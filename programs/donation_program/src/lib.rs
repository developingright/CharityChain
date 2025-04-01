use anchor_lang::prelude::*;
use anchor_lang::system_program;

declare_id!("HRU86175WzNtRa8kwonXSh2yLohLJVda2PM13KSv1eGm");

#[error_code]
pub enum DonationError {
    #[msg("Math operation overflow")]
    MathOverflow,
}

#[program]
pub mod donation_program {
    use super::*;

    pub fn initialize_campaign(
        ctx: Context<InitializeCampaign>,
        name: String,
        description: String,
        target_amount: u64,
        recipient_wallet: Pubkey,
    ) -> Result<()> {
        let campaign = &mut ctx.accounts.campaign;
        let authority = &ctx.accounts.authority;

        campaign.authority = authority.key();
        campaign.name = name;
        campaign.description = description;
        campaign.target_amount = target_amount;
        campaign.current_amount = 0;
        campaign.created_at = Clock::get()?.unix_timestamp;
        campaign.recipient_wallet = recipient_wallet;

        Ok(())
    }

    pub fn initialize_donation(
        ctx: Context<InitializeDonation>,
        name: String,
        organization: String,
        amount: u64,
    ) -> Result<()> {
        let donation = &mut ctx.accounts.donation;
        let donor = &ctx.accounts.donor;
        let campaign = &mut ctx.accounts.campaign;
        let recipient = &ctx.accounts.recipient_wallet;

        // Transfer SOL from donor to recipient_wallet (not to campaign)
        system_program::transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                system_program::Transfer {
                    from: donor.to_account_info(),
                    to: recipient.to_account_info(),
                },
            ),
            amount,
        )?;

        // Update campaign's current amount
        campaign.current_amount = campaign.current_amount
            .checked_add(amount)
            .ok_or(error!(DonationError::MathOverflow))?;

        // Set the donation details
        donation.donor = donor.key();
        donation.name = name;
        donation.organization = organization;
        donation.amount = amount;
        donation.timestamp = Clock::get()?.unix_timestamp;
        donation.campaign = campaign.key();

        // Emit an event for tracking
        emit!(DonationCreated {
            donor: donor.key(),
            campaign: campaign.key(),
            amount,
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeCampaign<'info> {
    #[account(
        init,
        payer = authority,
        space = Campaign::LEN,
        seeds = [
            b"campaign",
            authority.key().as_ref(),
        ],
        bump
    )]
    pub campaign: Account<'info, Campaign>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct InitializeDonation<'info> {
    #[account(
        init,
        payer = donor,
        space = DonationRecord::LEN,
        seeds = [
            b"donation",
            campaign.key().as_ref(),
            donor.key().as_ref(),
        ],
        bump
    )]
    pub donation: Account<'info, DonationRecord>,
    
    /// The campaign being donated to
    #[account(mut)]
    pub campaign: Account<'info, Campaign>,
    
    #[account(mut)]
    pub donor: Signer<'info>,

    /// CHECK: This is the wallet that will receive donations, verified to match the campaign's recipient_wallet
    #[account(
        mut,
        constraint = recipient_wallet.key() == campaign.recipient_wallet
    )]
    pub recipient_wallet: UncheckedAccount<'info>,
    
    pub system_program: Program<'info, System>,
}

#[account]
#[derive(Default)]
pub struct DonationRecord {
    pub donor: Pubkey,      // 32 bytes
    pub campaign: Pubkey,   // 32 bytes
    pub name: String,       // 4 + 50 bytes for max length
    pub organization: String, // 4 + 50 bytes for max length
    pub amount: u64,        // 8 bytes
    pub timestamp: i64,     // 8 bytes
}

#[account]
#[derive(Default)]
pub struct Campaign {
    pub authority: Pubkey,      // 32 bytes
    pub name: String,           // 4 + 50 bytes
    pub description: String,    // 4 + 200 bytes
    pub target_amount: u64,     // 8 bytes
    pub current_amount: u64,    // 8 bytes
    pub created_at: i64,        // 8 bytes
    /// CHECK: This is the wallet that will receive all donations. It is verified in the InitializeDonation context.
    pub recipient_wallet: Pubkey, // 32 bytes - NEW: Recipient of donations
}

const STRING_LENGTH: usize = 50;
const DESCRIPTION_LENGTH: usize = 200;

impl DonationRecord {
    const LEN: usize = 8 + // discriminator
        32 +               // donor pubkey
        32 +               // campaign pubkey
        (4 + STRING_LENGTH) + // name
        (4 + STRING_LENGTH) + // organization
        8 +                 // amount
        8;                 // timestamp
}

impl Campaign {
    const LEN: usize = 8 +        // discriminator
        32 +                      // authority pubkey
        (4 + STRING_LENGTH) +     // name
        (4 + DESCRIPTION_LENGTH) + // description
        8 +                       // target_amount
        8 +                       // current_amount
        8 +                       // created_at
        32;                       // recipient_wallet (NEW)
}

#[event]
pub struct DonationCreated {
    pub donor: Pubkey,
    pub campaign: Pubkey,
    pub amount: u64,
    pub timestamp: i64,
} 