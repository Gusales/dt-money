import { ReactNode, useCallback, useEffect, useState } from 'react'
import { api } from '../lib/axios'
import { createContext } from 'use-context-selector'

interface TransactionsTypes {
  id: number
  category: string
  createdAt: string
  description: string
  type: 'income' | 'outcome'
  price: number
}

interface CreateTransactionInputs {
  description: string
  price: number
  category: string
  type: 'income' | 'outcome'
}

interface TransactionsContextTypes {
  transactions: TransactionsTypes[] | []
  fetchTransactions: (query?: string) => Promise<void>
  createNewTransaction: (data: CreateTransactionInputs) => Promise<void>
}

export const TransactionsContext = createContext({} as TransactionsContextTypes)

interface TransactionsProviderProps {
  children: ReactNode
}

export function TransactionsProvider({ children }: TransactionsProviderProps) {
  const [transactions, setTransactions] = useState<TransactionsTypes[] | []>([])

  const fetchTransactions = useCallback(async (query?: string) => {
    const { data } = await api.get('/transactions', {
      params: {
        _sort: 'createdAt',
        _order: 'desc',
        q: query,
      },
    })
    setTransactions(data)
  }, [])

  const createNewTransaction = useCallback(
    async (data: CreateTransactionInputs) => {
      const { category, description, price, type } = data

      const response = await api.post('/transactions', {
        category,
        description,
        price,
        type,
        createdAt: new Date(),
      })
      setTransactions((state) => [response.data, ...state])
    },
    [],
  )
  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])
  return (
    <TransactionsContext.Provider
      value={{ transactions, fetchTransactions, createNewTransaction }}
    >
      {children}
    </TransactionsContext.Provider>
  )
}
