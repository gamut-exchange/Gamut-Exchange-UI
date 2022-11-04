import { useMemo } from 'react'
import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'
import {
  goerliClient,
} from '../apollo/client'

export const POOL_WEIGHTS = gql`
  query poolWeights($address: Bytes!) {
    weightBalanceDatas(last:100, orderBy: timestamp, orderDirection: asc, where: { pool: $address }, subgraphError: allow) {
      id
      timestamp
      weight0
      weight1
      token0 {
        symbol
      }
      token1 {
        symbol
      }
    }
  }
`

export const POOL_PRICES = (poolString) => {
  return gql`
  query poolTokenPrices {
    poolTokensPrices(last:300, orderBy: timestamp, orderDirection: asc, where: { pool_in: ${poolString} }, subgraphError: allow) {
      id
      timestamp
      token0Price
      token1Price
      pool {
        id
      }
      token0 {
        id
        symbol
      }
      token1 {
        id
        symbol
      }
    }
  }
`
}

/**
 * Fetch weights
 */
export function useWeightsData(address) {
  const { loading, error, data } = useQuery(POOL_WEIGHTS, {
    client: goerliClient,
    variables: {
      address: address,
    },
    fetchPolicy: 'cache-first',
  })

  const formattedData = useMemo(() => {
    if (data) {
      return data.weightBalanceDatas
    } else {
      return undefined
    }
  }, [data])

  return {
    loading: loading,
    error: Boolean(error),
    weights: formattedData,
  }
}

/**
 * Fetch tokenPrices
 */
export function useTokenPricesData(addresses) {
  let poolString = `[`
  addresses.map((address) => {
    return (poolString += `"${address}",`)
  })
  poolString += ']'
  const { loading, error, data } = useQuery(POOL_PRICES(poolString), {
    client: goerliClient,
    variables: {},
    fetchPolicy: 'cache-first',
  })
  const formattedData = useMemo(() => {
    if (data) {
      return data.poolTokensPrices
    } else {
      return undefined
    }
  }, [data])
  return {
    loading: loading,
    error: Boolean(error),
    prices: formattedData,
  }
}
