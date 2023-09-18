'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateUserRoles } from '@/api/requests/super-admin/update-user-roles';
import { SuperAdminUpdateUserRoleRequestSchema } from '@/contract/auth/super-admin-update-role.request.dto';
import { SuperAdminUpdateUserRoleRequestDto } from '@/contract/auth/super-admin-update-role.request.dto.d';
import { getAppRoles } from '@/utils/get-app-roles';
import { getSuperAdminCookieOnClient } from '@/utils/get-super-admin-cookie-client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Settings } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';

interface UpdateRolesFormProps {
  userId: string;
  defaultRoles: string[];
}

const roles = getAppRoles().map((role) => ({ id: role, label: role }));

export function UpdateRolesForm({
  userId,
  defaultRoles,
}: UpdateRolesFormProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { adminCredentialsCookie } = getSuperAdminCookieOnClient();
  const { mutate: updateUserRolesReq, isLoading } = useMutation({
    mutationFn: (values: Omit<SuperAdminUpdateUserRoleRequestDto, 'userId'>) =>
      updateUserRoles(
        userId,
        values,
        adminCredentialsCookie?.email ?? '',
        adminCredentialsCookie?.password ?? ''
      ),
    onError: (error: any) => {
      toast({
        title: error,
        variant: 'destructive',
      });
    },
    onSuccess: (room) => {
      setOpen(false);
      toast({
        title: 'Roles updated successfully!',
      });
      form.reset();
      // this refresh next server component https://nextjs.org/docs/app/api-reference/functions/use-router
      router.refresh();
    },
  });
  const form = useForm<Pick<SuperAdminUpdateUserRoleRequestDto, 'roles'>>({
    resolver: zodResolver(
      SuperAdminUpdateUserRoleRequestSchema.omit({ userId: true })
    ),
    values: {
      roles: defaultRoles,
    },
  });

  function onSubmit(
    values: Omit<SuperAdminUpdateUserRoleRequestDto, 'userId'>
  ) {
    try {
      updateUserRolesReq(values);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <Settings />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>User Roles</DialogTitle>
          <DialogDescription>
            Manage this users&apos; roles in intelli-mate
          </DialogDescription>
          <Separator className="!my-4" />
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="roles"
                render={() => (
                  <FormItem>
                    {roles.map((role) => (
                      <FormField
                        key={role.id}
                        control={form.control}
                        name="roles"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={role.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(role.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([
                                          ...field.value,
                                          role.id,
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== role.id
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {role.label}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex w-full justify-end">
                <Button disabled={isLoading} type="submit">
                  Submit
                </Button>
              </div>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
