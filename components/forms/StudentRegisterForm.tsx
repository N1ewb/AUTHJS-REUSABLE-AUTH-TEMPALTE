"use client";

import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { signUp } from "@/actions/client/user.action";

export const signinschema = z
  .object({
    email: z.string().email().nonempty("Email is required!"),
    first_name: z.string().nonempty("First name is required!"),
    last_name: z.string().nonempty("Last name is required!"),
    role: z.enum(["student", "instructor", "admin"], {
      required_error: "Role is required!",
    }),
    password: z
      .string()
      .min(8, "Password should at least be 8 characters")
      .nonempty("Password is required!"),
    confirm_password: z
      .string()
      .min(8, "Password should at least be 8 characters")
      .nonempty("Password is required!"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export type SignupData = z.infer<typeof signinschema>;

export function SignupForm() {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof signinschema>>({
    resolver: zodResolver(signinschema),
    defaultValues: {
      email: "",
      first_name: "",
      last_name: "",
      password: "",
      confirm_password: "",
      role: "student",
    },
  });

  const [loading, setLoading] = useState(false);

  async function onSubmit(values: z.infer<typeof signinschema>) {
    try {
      setLoading(true);
      const res = await signUp(values);
      console.log("values", values);
      console.log("RES", res);
      if (res && res.data.status === "success") {
        toast({
          title: "Sign in",
          description: " Signed in successfully",
        });
      } else {
        toast({
          title: "Sign in",
          description: " Signed in failed",
          variant: "destructive",
        });
      }
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="first_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder="first_name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="last_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input placeholder="last_name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="Password" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirm_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input
                  placeholder="confirm_Password"
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={loading} className="w-full" type="submit">
          {loading ? "Signing in..." : "Sign up"}
        </Button>
      </form>
    </Form>
  );
}
