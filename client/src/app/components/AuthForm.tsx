"use client"

import { useState } from "react"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import Image from "next/image"
import Link from "next/link"

const formSchema = z.object({
  username: z.string().min(2).max(50),
  fullName: z.string().min(2).max(100).optional(),
  email: z.string().email()
})

type FormType = "sign-in" | "sign-up";

const AuthForm = ({ type }: { type: FormType }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  const form = useForm<z.infer<typeof formSchema>>({
    //z.infer<typeof formSchema> automatically generates TypeScript types from your Zod schema

    resolver: zodResolver(formSchema),
    //zodResolver(formSchema) connects Zod validation to React Hook Form

    defaultValues: {
      username: "",
      fullName: "",
      email: ""
    },
  })
      
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }
   
  return (
    <>
      <Form {...form}>
        <form 
          onSubmit={form.handleSubmit(onSubmit)} 
          className="space-y-6 w-full max-w-md mx-auto p-8 rounded-xl border border-gray-200 shadow-xl bg-white"
        >
          <h1 className="text-2xl font-bold text-center mb-6">
            {type === "sign-in" ? "Sign In" : "Sign Up"}
          </h1>
          
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-medium">Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your username"
                    className="shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-xs" />
              </FormItem>
            )}
          />
          
          {type === "sign-up" && (
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-medium">Full Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your full name"
                      className="shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />
          )}
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-medium">Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your email"
                    type="email"
                    className="shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-xs" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-brand hover:bg-brand/90 py-5 shadow-md hover:shadow-lg transition-all duration-200"
            disabled={isLoading}
          >
            {type === "sign-in" ? "Sign In" : "Sign Up"}
            {isLoading && (
              <Image
                src="/assets/icons/loader.svg"
                alt="loader"
                width={24}
                height={24}
                className="ml-2 animate-spin"
              />
            )}
          </Button>
          
          {errorMessage && <p className="text-red-500 text-sm mt-2 font-medium">*{errorMessage}</p>}

          <div className="text-sm flex justify-center pt-2">
            <p className="text-gray-500">
              {type === "sign-in"
                ? "Don't have an account?"
                : "Already have an account?"}
            </p>
            <Link
              href={type === "sign-in" ? "/sign-up" : "/sign-in"}
              className="ml-1 font-medium text-brand hover:text-zinc-500 transition-colors duration-200"
            >
              {" "}
              {type === "sign-in" ? "Sign Up" : "Sign In"}
            </Link>
          </div>
          
        </form>
      </Form>
    </>
  )
}

export default AuthForm