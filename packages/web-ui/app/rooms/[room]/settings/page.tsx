import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { UpdateRoomForm } from '@/components/update-room-form';

export default function Settings() {
  return (
    <div className="p-6">
      <Card className="h-fit w-full">
        <CardHeader>
          <CardTitle> Room Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex-1 p-4">
            <UpdateRoomForm />
            <div>owner cenas</div>
            <div>search for a user section</div>
            <div>in the bottom right if not owner can leave room</div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="ghost">Cancel</Button>
          <Button>Deploy</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
