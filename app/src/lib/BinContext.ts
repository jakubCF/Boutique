import { Bin } from '@/types/Bin';
import { createContext } from 'react';

export const BinContext = createContext<Bin[]>([]);