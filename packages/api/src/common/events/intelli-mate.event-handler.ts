import { IntelliMateEvent } from '@/common/events/intelli-mate.event';

export interface IntelliMateEventHandler {
  handleEvent(event: IntelliMateEvent): Promise<void>;
}
