import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import useCreate from '../hooks/useCreate';
import { useNavigate } from "react-router-dom";
export default function MultiStepForm() {
  const {createCampaign} = useCreate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    public_key: "",
    target: "",
  });
  const [errors, setErrors] = useState({
    title: "",
    description: "",
    public_key: "",
    target: "",
  });

  const validateField = (name: string, value: string) => {
    let error = "";
    switch (name) {
      case "title":
        if (value.length < 2) error = "Title must be at least 2 characters.";
        break;
      case "description":
        if (value.length < 10)
          error = "Description must be at least 10 characters.";
        break;
      case "public_key":
        if (value.length < 5)
          error = "Public key must be at least 5 characters.";
        break;
      case "target":
        if (value.length < 1) error = "Target is required.";
        break;
    }
    return error;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const nextStep = () => {
    let fieldsToValidate: string[] = [];
    switch (step) {
      case 1:
        fieldsToValidate = ["title"];
        break;
      case 2:
        fieldsToValidate = ["description"];
        break;
      case 3:
        fieldsToValidate = ["public_key", "target"];
        break;
    }

    const newErrors = { ...errors };
    let isValid = true;

    fieldsToValidate.forEach((field) => {
      const error = validateField(
        field,
        formData[field as keyof typeof formData]
      );
      newErrors[field as keyof typeof errors] = error;
      if (error) isValid = false;
    });

    setErrors(newErrors);

    if (isValid) {
      setStep((prevStep) => prevStep + 1);
    }
  };

  const prevStep = () => setStep((prevStep) => prevStep - 1);
  const navigate = useNavigate();
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createCampaign(formData);
    navigate("/dashboard");
  };

  return (
    <div className="w-full flex items-center h-screen justify-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Multi-Step Form</CardTitle>
          <CardDescription>Step {step} of 3</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-8">
            {step === 1 && (
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  This is the title of your form submission.
                </p>
              </div>
            )}
            {step === 2 && (
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter description"
                  className="resize-none"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                />
                {errors.description && (
                  <p className="text-sm text-red-500">{errors.description}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  Provide a detailed description.
                </p>
              </div>
            )}
            {step === 3 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="public_key">Public Key</Label>
                  <Input
                    id="public_key"
                    placeholder="Enter public key"
                    name="public_key"
                    value={formData.public_key}
                    onChange={handleChange}
                  />
                  {errors.public_key && (
                    <p className="text-sm text-red-500">{errors.public_key}</p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    Enter your public key.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="target">Target</Label>
                  <Input
                    id="target"
                    placeholder="Enter target"
                    name="target"
                    value={formData.target}
                    onChange={handleChange}
                  />
                  {errors.target && (
                    <p className="text-sm text-red-500">{errors.target}</p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    Specify your target.
                  </p>
                </div>
              </>
            )}
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          {step > 1 && (
            <Button variant="outline" onClick={prevStep}>
              Previous
            </Button>
          )}
          {step < 3 ? (
            <Button onClick={nextStep}>Next</Button>
          ) : (
            <Button onClick={onSubmit}>Submit</Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
