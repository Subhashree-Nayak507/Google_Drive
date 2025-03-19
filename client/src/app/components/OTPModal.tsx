"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

import { useRouter } from "next/navigation";

const OtpModal = ({
  accountId,
  email,
}: {
  accountId: string;
  email: string;
}) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);

    console.log({ accountId, password });
    setIsLoading(false);
  };

  const handleResendOtp = async () => {
    //  await sendEmailOTP({ email });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="bg-background p-6 rounded-lg shadow-lg max-w-md w-full">
        <AlertDialogHeader className="relative flex justify-center">
          <AlertDialogTitle className="text-xl font-bold text-center mb-2">
            Enter Your OTP
            <div 
              className="absolute right-0 top-0 cursor-pointer"
              onClick={() => setIsOpen(false)}
            >
              <Image
                src="/assets/icons/close-dark.svg"
                alt="close"
                width={20}
                height={20}
              />
            </div>
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-center text-muted-foreground">
            We&apos;ve sent a code to{" "}
            <span className="pl-1 text-primary font-medium">{email}</span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <InputOTP maxLength={6} value={password} onChange={setPassword}>
          <InputOTPGroup className="flex gap-2 justify-center my-6">
            <InputOTPSlot index={0} className="w-10 h-12 border rounded bg-background text-center" />
            <InputOTPSlot index={1} className="w-10 h-12 border rounded bg-background text-center" />
            <InputOTPSlot index={2} className="w-10 h-12 border rounded bg-background text-center" />
            <InputOTPSlot index={3} className="w-10 h-12 border rounded bg-background text-center" />
            <InputOTPSlot index={4} className="w-10 h-12 border rounded bg-background text-center" />
            <InputOTPSlot index={5} className="w-10 h-12 border rounded bg-background text-center" />
          </InputOTPGroup>
        </InputOTP>

        <AlertDialogFooter>
          <div className="flex w-full flex-col gap-4">
            <AlertDialogAction
              onClick={handleSubmit}
              className="bg-primary text-primary-foreground hover:bg-primary/90 w-full h-12 rounded-md font-medium"
              type="button"
            >
              <span className="flex items-center justify-center">
                Submit
                {isLoading && (
                  <Image
                    src="/assets/icons/loader.svg"
                    alt="loader"
                    width={24}
                    height={24}
                    className="ml-2 animate-spin"
                  />
                )}
              </span>
            </AlertDialogAction>

            <div className="text-sm text-center text-muted-foreground mt-2">
              Didn&apos;t get a code?
              <Button
                type="button"
                variant="link"
                className="pl-1 text-primary"
                onClick={handleResendOtp}
              >
                Click to resend
              </Button>
            </div>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default OtpModal;