"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
Card,
CardContent,
CardDescription,
CardHeader,
CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function FormPage() {
const [step, setStep] = useState(1);

const [formData, setFormData] = useState({
name: "",
email: "",
});

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setFormData({
  ...formData,
  [e.target.name]: e.target.value,
  });
  };

  const nextStep = () => {
  setStep(step + 1);
  };

  const previousStep = () => {
  setStep(step - 1);
  };

  return (
  <div className="flex min-h-screen items-center justify-center bg-muted/40 p-6">
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Create Your Profile</CardTitle>
        <CardDescription>
          Complete the steps below to create your profile.
        </CardDescription>

        {/* Step indicator */}
        <div className="pt-4">
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary transition-all duration-500 ease-in-out" style={{ width:
              `${(step / 3) * 100}%`, }} />
          </div>

          <p className="mt-2 text-sm text-muted-foreground">
            Step {step} of 3
          </p>
        </div>

      </CardHeader>

      <CardContent>
        {/* STEP 1 */}
        {step === 1 && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>

            <Input id="name" name="name" placeholder="John Doe" value={formData.name} onChange={handleChange} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>

            <Input id="email" name="email" type="email" placeholder="john@example.com" value={formData.email}
              onChange={handleChange} />
          </div>

          <div className="flex justify-end pt-4">
            <Button onClick={nextStep}>
              Continue
            </Button>
          </div>
        </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">
              Your Preferences
            </h2>

            <p className="text-sm text-muted-foreground">
              Tell us a little more about yourself.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>

            <Input id="role" placeholder="Frontend Developer" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience">Experience</Label>

            <Input id="experience" placeholder="2 years" />
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={previousStep}>
              Back
            </Button>

            <Button onClick={nextStep}>
              Continue
            </Button>
          </div>
        </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold">
              Review Your Information
            </h2>

            <p className="text-sm text-muted-foreground">
              Make sure everything looks correct.
            </p>
          </div>

          <div className="space-y-3 rounded-lg border p-4">
            <div>
              <p className="text-sm text-muted-foreground">
                Name
              </p>

              <p className="font-medium">
                {formData.name || "Not provided"}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Email
              </p>

              <p className="font-medium">
                {formData.email || "Not provided"}
              </p>
            </div>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={previousStep}>
              Back
            </Button>

            <Button onClick={()=> alert("Profile created!")}
              >
              Create Profile
            </Button>
          </div>
        </div>
        )}
      </CardContent>
    </Card>
  </div>
  );
  }
