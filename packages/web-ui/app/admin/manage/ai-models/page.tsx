import React from 'react';
import {
  ADMIN_GET_AI_MODELS_REQ_KEY,
  adminGetAiModels,
} from '@/api/requests/super-admin/admin-get-ai-models';
import { getSuperAdminCookieOnServer } from '@/utils/get-super-admin-cookie-server';

import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { AddAiModelsForm } from '@/components/admin/add-ai-models-form';
import { HoverableTableCell } from '@/components/admin/hoverable-table-cell';
import getQueryClient from '@/app/get-query-client';

export default async function AdminAiModels() {
  const { adminCredentialsCookie } = getSuperAdminCookieOnServer();
  const adminCredentials = JSON.parse(adminCredentialsCookie!.value);
  const queryClient = getQueryClient();
  const aiModels = await queryClient.fetchQuery({
    queryKey: [ADMIN_GET_AI_MODELS_REQ_KEY],
    queryFn: () =>
      adminGetAiModels(adminCredentials.email, adminCredentials.password),
  });

  return (
    <div className="flex size-full flex-col p-4">
      <div className="mb-4 flex w-full justify-end">
        <AddAiModelsForm />
      </div>
      <Card className="size-full">
        <ScrollArea className="h-full">
          <Table>
            <TableCaption>
              All intelli-mate AI Models are listed here.
            </TableCaption>
            <TableHeader className="sticky top-0 bg-background">
              <TableRow>
                <TableHead>LLM Name</TableHead>
                <TableHead>Alias</TableHead>
                <TableHead>Model Name</TableHead>
                <TableHead>Temperature</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {aiModels.map((aiModel) => (
                <TableRow key={aiModel.id}>
                  <TableCell>{aiModel.chatLlmName}</TableCell>
                  <TableCell>{aiModel.alias ?? 'N/A'}</TableCell>
                  <TableCell>{aiModel.modelName}</TableCell>
                  <TableCell>{aiModel.temperature}</TableCell>
                  <TableCell>
                    <HoverableTableCell text={aiModel.description} />
                  </TableCell>
                  <TableCell className="text-right">Edit BTN</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </Card>
    </div>
  );
}
