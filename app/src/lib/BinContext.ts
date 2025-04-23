import { Bin } from '@/types/Bin';
import { createContext } from 'react';

/**
 * BinContext provides a way to share an array of `Bin` objects throughout the application.
 *
 * This context is initialized with an empty array as the default value. Components
 * that consume this context will receive the current array of `Bin` objects, allowing
 * them to access and update bin information.
 *
 * @defaultValue `[]` - An empty array of `Bin` objects.
 * 
 */
export const BinContext = createContext<Bin[]>([]);