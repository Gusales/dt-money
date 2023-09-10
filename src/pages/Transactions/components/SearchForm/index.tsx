import { MagnifyingGlass } from 'phosphor-react'
import { SearchFormContainer } from './styles'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useContextSelector } from 'use-context-selector'
import { TransactionsContext } from '../../../../contexts/TransactionsContext'
import { memo } from 'react'

/**
 * Por que componentes renderizam?
 * 1 - Hooks changed (mudou estado, mudou contexto, reducer);
 * 2 - Props changed (mudou as propriedades do componentes);
 * 3 - Parents rerendering (o componente pai renderizou);
 *
 * Fluxo de renderização do React
 * 1 - React cria o HTML da interface daquele componente;
 * 2 - Compara a versão do HTML recriado com a versão anterior;
 * 3 - SE mudou alguma coisa, ele reescreve o HTML;
 *
 * Utilizando o MEMO:
 * 0 - Hooks changed, Props changed (deep comparison)
 * 0.1 - Comparar a versão anterior dos hooks e props
 * 0.2 - SE mudou, permite a nova renderização
 */

const searchFormSchema = z.object({
  query: z.string(),
})

type SearchFormData = z.infer<typeof searchFormSchema>

function SearchFormComponent() {
  const fetchTransactions = useContextSelector(
    TransactionsContext,
    (context) => {
      return context.fetchTransactions
    },
  )

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SearchFormData>({
    resolver: zodResolver(searchFormSchema),
  })

  async function handleSearchTransactions(data: SearchFormData) {
    await fetchTransactions(data.query)
  }

  return (
    <SearchFormContainer onSubmit={handleSubmit(handleSearchTransactions)}>
      <input
        type="text"
        placeholder="Busque por transações"
        {...register('query')}
      />
      <button disabled={isSubmitting}>
        <MagnifyingGlass size={20} />
        buscar
      </button>
    </SearchFormContainer>
  )
}

export const SearchForm = memo(SearchFormComponent)
