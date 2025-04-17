import { Bin } from '@/types/Bin';
import Item from '@/types/Item';
import { Table } from '@tanstack/react-table';
import { Table } from 'lucide-react';
import { createContext } from 'react';

export const ItemTableContext = createContext<Table<Item> | null>(null);