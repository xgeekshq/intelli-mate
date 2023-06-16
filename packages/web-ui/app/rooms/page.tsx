import { SearchListType } from '@/types/searchList';
import { SearchList } from '@/components/search-list';

const languages: SearchListType[] = [
  { label: 'English', value: 'en' },
  { label: 'French', value: 'fr' },
  { label: 'German', value: 'de' },
  { label: 'Spanish', value: 'es' },
  { label: 'Portuguese', value: 'pt' },
  { label: 'Russian', value: 'ru' },
  { label: 'Japanese', value: 'ja' },
  { label: 'Korean', value: 'ko' },
  { label: 'Chinese', value: 'zh' },
  { label: 'English', value: 'en' },
  { label: 'French', value: 'fr' },
  { label: 'German', value: 'de' },
  { label: 'Spanish', value: 'es' },
  { label: 'Portuguese', value: 'pt' },
  { label: 'Russian', value: 'ru' },
  { label: 'Japanese', value: 'ja' },
  { label: 'Korean', value: 'ko' },
  { label: 'Chinese', value: 'zh' },
];
export default function Rooms() {
  return (
    <div className="flex h-full w-full flex-col items-center">
      <h2>Join a room and start collaborating in a conversation with AI!</h2>
      <SearchList
        data={languages}
        notFoundText="Room not found."
        searchPlaceholder="Type a room name"
        searchText="Search for a room"
      />
    </div>
  );
}
