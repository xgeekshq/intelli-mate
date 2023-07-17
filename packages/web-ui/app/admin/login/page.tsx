'use client';

import { useRouter } from 'next/navigation';
import Endpoints from '@/api/endpoints';
import { superAdminApiClient } from '@/api/superAdminApiClient';
import { SuperAdminValidateCredentialsRequestSchema } from '@/contract/auth/super-admin-validate-credentials.request.dto';
import { SuperAdminValidateCredentialsRequestDto } from '@/contract/auth/super-admin-validate-credentials.request.dto.d';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

export default function SuperAdminLogin() {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<SuperAdminValidateCredentialsRequestDto>({
    resolver: zodResolver(SuperAdminValidateCredentialsRequestSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: SuperAdminValidateCredentialsRequestDto) {
    try {
      const res = await superAdminApiClient({
        url: Endpoints.admin.validateCredentials(),
        options: { method: 'POST', body: JSON.stringify(values) },
      });
      if (!res.ok) {
        const { error } = JSON.parse(await res.text());
        toast({
          title: error,
          variant: 'destructive',
        });
        return;
      }
      router.push('/admin');
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className="flex h-full w-full flex-col items-center py-24">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-2/12 space-y-8"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Super Admin Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" {...field} />
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
                <FormLabel>Super Admin Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Password" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="flex w-full justify-end">
            <Button type="submit">Login</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
