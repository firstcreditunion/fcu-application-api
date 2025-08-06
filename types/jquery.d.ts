// Type definitions for jQuery and CreditSense
declare global {
  interface Window {
    $: JQueryStatic
    jQuery: JQueryStatic
  }

  interface JQueryStatic {
    CreditSense?: {
      Iframe: (config: CreditSenseConfig) => void
    }
    when: (deferred: JQueryDeferred<unknown>) => JQueryPromise<unknown>
    ready: JQueryPromise<unknown>
  }
}

interface CreditSenseConfig {
  client: string
  elementSelector: string
  enableDynamicHeight?: boolean
  params: {
    hideSuccess?: boolean
    appRef?: string
    uniqueAppRef?: boolean
    cssOverride?: string
    [key: string]: unknown
  }
  callback?: (response: string, data: unknown) => void
}

interface JQueryDeferred<T> {
  promise(): JQueryPromise<T>
}

interface JQueryPromise<T> {
  then<U>(
    onFulfilled?: (value: T) => U | JQueryPromise<U>,
    onRejected?: (reason: unknown) => U | JQueryPromise<U>
  ): JQueryPromise<U>
  catch<U>(
    onRejected?: (reason: unknown) => U | JQueryPromise<U>
  ): JQueryPromise<U>
}

export {}
