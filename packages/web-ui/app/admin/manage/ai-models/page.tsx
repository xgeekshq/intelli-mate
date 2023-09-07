import React from 'react';
import { cookies } from 'next/headers';
import Endpoints from '@/api/endpoints';
import { superAdminApiClient } from '@/api/superAdminApiClient';
import { SuperAdminAiModelResponseDto } from '@/contract/ai/super-admin-ai-model.response.dto.d';

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

const getAiModels = async (
  superAdminEmail: string,
  superAdminPassword: string
): Promise<SuperAdminAiModelResponseDto[]> => {
  try {
    const res = await superAdminApiClient({
      url: Endpoints.admin.getAiModels(),
      options: { method: 'GET' },
      superAdminEmail,
      superAdminPassword,
    });
    return res.json();
  } catch (e) {
    console.log(e);
  }
  return [];
};

export default async function AdminAiModels() {
  const nextCookies = cookies();
  const adminCredentialsCookie = nextCookies.get('__admin');
  const adminCredentials = JSON.parse(adminCredentialsCookie!.value);

  const aiModels = await getAiModels(
    adminCredentials.email,
    adminCredentials.password
  );

  return (
    <div className="flex h-full w-full flex-col p-4">
      <div className="mb-4 flex w-full justify-end">
        <AddAiModelsForm />
      </div>
      <Card className="h-full w-full">
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
                  <TableCell>{aiModel.chatLlmName ?? 'N/A'}</TableCell>
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
