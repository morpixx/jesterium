/**
 * Утиліта для обробки помилок блокчейну
 * Містить класифіковані типи помилок та методи обробки для різних блокчейн-мереж
 */

// Класифікація типів помилок блокчейну
const BlockchainErrorTypes = {
  // Solana специфічні помилки
  SOLANA: {
    TRANSACTION_ERROR: 'solana_transaction_error',
    ACCOUNT_NOT_FOUND: 'solana_account_not_found',
    INSUFFICIENT_FUNDS: 'solana_insufficient_funds',
    INVALID_BLOCKHASH: 'solana_invalid_blockhash',
    INSTRUCTION_ERROR: 'solana_instruction_error',
    SIGNATURE_VERIFICATION_FAILED: 'solana_signature_verification_failed',
    TIMEOUT: 'solana_timeout',
  },
  
  // Ethereum специфічні помилки
  ETHEREUM: {
    GAS_PRICE_TOO_LOW: 'eth_gas_price_too_low',
    NONCE_TOO_LOW: 'eth_nonce_too_low',
    INSUFFICIENT_FUNDS: 'eth_insufficient_funds',
    CONTRACT_EXECUTION_ERROR: 'eth_contract_execution_error',
    TRANSACTION_UNDERPRICED: 'eth_transaction_underpriced',
    TIMEOUT: 'eth_timeout',
  },
  
  // Загальні помилки
  GENERAL: {
    CONNECTION_ERROR: 'blockchain_connection_error',
    NETWORK_CONGESTION: 'blockchain_network_congestion',
    UNSUPPORTED_CHAIN: 'blockchain_unsupported_chain',
    INVALID_SEED_PHRASE: 'blockchain_invalid_seed_phrase',
    INVALID_ADDRESS: 'blockchain_invalid_address',
    UNAUTHORIZED: 'blockchain_unauthorized_operation',
    UNKNOWN: 'blockchain_unknown_error',
  }
};

/**
 * Обробник помилок Solana
 * @param {Error} error - об'єкт помилки
 * @returns {Object} - класифікована помилка з кодом та описом
 */
function handleSolanaError(error) {
  const errorCode = error.code || '';
  const errorMessage = error.message || '';
  
  // Визначення типу помилки Solana на основі коду чи повідомлення
  if (errorMessage.includes('insufficient funds')) {
    return {
      type: BlockchainErrorTypes.SOLANA.INSUFFICIENT_FUNDS,
      code: 400,
      message: 'Недостатньо коштів для виконання транзакції',
      details: error.message,
      originalError: error
    };
  } else if (errorMessage.includes('account not found')) {
    return {
      type: BlockchainErrorTypes.SOLANA.ACCOUNT_NOT_FOUND,
      code: 404,
      message: 'Обліковий запис не знайдено в блокчейні Solana',
      details: error.message,
      originalError: error
    };
  } else if (errorMessage.includes('blockhash')) {
    return {
      type: BlockchainErrorTypes.SOLANA.INVALID_BLOCKHASH,
      code: 400,
      message: 'Недійсний блокхеш або він застарів',
      details: error.message,
      originalError: error
    };
  } else if (errorMessage.includes('signature verification failed')) {
    return {
      type: BlockchainErrorTypes.SOLANA.SIGNATURE_VERIFICATION_FAILED,
      code: 400,
      message: 'Помилка перевірки підпису',
      details: error.message,
      originalError: error
    };
  } else if (errorMessage.includes('instruction error')) {
    return {
      type: BlockchainErrorTypes.SOLANA.INSTRUCTION_ERROR,
      code: 400,
      message: 'Помилка виконання інструкції в транзакції',
      details: error.message,
      originalError: error
    };
  } else if (errorMessage.includes('timeout')) {
    return {
      type: BlockchainErrorTypes.SOLANA.TIMEOUT,
      code: 408,
      message: 'Час очікування відповіді від мережі Solana вичерпано',
      details: error.message,
      originalError: error
    };
  }
  
  // Якщо конкретну помилку не визначено
  return {
    type: BlockchainErrorTypes.SOLANA.TRANSACTION_ERROR,
    code: 500,
    message: 'Помилка транзакції Solana',
    details: error.message,
    originalError: error
  };
}

/**
 * Обробник помилок Ethereum
 * @param {Error} error - об'єкт помилки
 * @returns {Object} - класифікована помилка з кодом та описом
 */
function handleEthereumError(error) {
  const errorMessage = error.message || '';
  
  if (errorMessage.includes('insufficient funds')) {
    return {
      type: BlockchainErrorTypes.ETHEREUM.INSUFFICIENT_FUNDS,
      code: 400,
      message: 'Недостатньо коштів для виконання транзакції',
      details: error.message,
      originalError: error
    };
  } else if (errorMessage.includes('gas price')) {
    return {
      type: BlockchainErrorTypes.ETHEREUM.GAS_PRICE_TOO_LOW,
      code: 400,
      message: 'Занадто низька ціна газу для транзакції',
      details: error.message,
      originalError: error
    };
  } else if (errorMessage.includes('nonce')) {
    return {
      type: BlockchainErrorTypes.ETHEREUM.NONCE_TOO_LOW,
      code: 400,
      message: 'Неправильний nonce для транзакції',
      details: error.message,
      originalError: error
    };
  } else if (errorMessage.includes('execution reverted')) {
    return {
      type: BlockchainErrorTypes.ETHEREUM.CONTRACT_EXECUTION_ERROR,
      code: 400,
      message: 'Помилка виконання смарт-контракту',
      details: error.message,
      originalError: error
    };
  } else if (errorMessage.includes('underpriced')) {
    return {
      type: BlockchainErrorTypes.ETHEREUM.TRANSACTION_UNDERPRICED,
      code: 400,
      message: 'Транзакція недооцінена, збільште ціну газу',
      details: error.message,
      originalError: error
    };
  } else if (errorMessage.includes('timeout')) {
    return {
      type: BlockchainErrorTypes.ETHEREUM.TIMEOUT,
      code: 408,
      message: 'Час очікування відповіді від мережі Ethereum вичерпано',
      details: error.message,
      originalError: error
    };
  }
  
  return {
    type: BlockchainErrorTypes.GENERAL.UNKNOWN,
    code: 500,
    message: 'Невідома помилка Ethereum',
    details: error.message,
    originalError: error
  };
}

/**
 * Обробник загальних помилок блокчейну
 * @param {Error} error - об'єкт помилки
 * @returns {Object} - класифікована помилка з кодом та описом
 */
function handleGeneralBlockchainError(error) {
  const errorMessage = error.message || '';
  
  if (errorMessage.includes('connection')) {
    return {
      type: BlockchainErrorTypes.GENERAL.CONNECTION_ERROR,
      code: 503,
      message: 'Помилка підключення до блокчейну',
      details: error.message,
      originalError: error
    };
  } else if (errorMessage.includes('congestion')) {
    return {
      type: BlockchainErrorTypes.GENERAL.NETWORK_CONGESTION,
      code: 503,
      message: 'Перевантаження мережі блокчейну',
      details: error.message,
      originalError: error
    };
  } else if (errorMessage.includes('unsupported chain')) {
    return {
      type: BlockchainErrorTypes.GENERAL.UNSUPPORTED_CHAIN,
      code: 400,
      message: 'Непідтримуваний блокчейн',
      details: error.message,
      originalError: error
    };
  } else if (errorMessage.includes('seed phrase') || errorMessage.includes('mnemonic')) {
    return {
      type: BlockchainErrorTypes.GENERAL.INVALID_SEED_PHRASE,
      code: 400,
      message: 'Недійсна seed phrase',
      details: error.message,
      originalError: error
    };
  } else if (errorMessage.includes('address')) {
    return {
      type: BlockchainErrorTypes.GENERAL.INVALID_ADDRESS,
      code: 400,
      message: 'Недійсна адреса гаманця',
      details: error.message,
      originalError: error
    };
  } else if (errorMessage.includes('unauthorized')) {
    return {
      type: BlockchainErrorTypes.GENERAL.UNAUTHORIZED,
      code: 401,
      message: 'Неавторизована операція в блокчейні',
      details: error.message,
      originalError: error
    };
  }
  
  return {
    type: BlockchainErrorTypes.GENERAL.UNKNOWN,
    code: 500,
    message: 'Невідома помилка блокчейну',
    details: error.message,
    originalError: error
  };
}

/**
 * Головний метод для обробки помилок блокчейну
 * @param {Error} error - об'єкт помилки
 * @param {string} blockchain - тип блокчейну ('solana', 'ethereum', etc.)
 * @returns {Object} - класифікована помилка з кодом та описом
 */
function handleBlockchainError(error, blockchain = 'unknown') {
  // Обробка помилок в залежності від типу блокчейну
  switch (blockchain.toLowerCase()) {
    case 'solana':
      return handleSolanaError(error);
    case 'ethereum':
      return handleEthereumError(error);
    default:
      return handleGeneralBlockchainError(error);
  }
}

/**
 * Визначення типу блокчейну за типом гаманця
 * @param {string} walletName - назва гаманця (Phantom, MetaMask, etc.)
 * @returns {string} - тип блокчейну
 */
function getBlockchainTypeByWallet(walletName) {
  if (!walletName) return 'unknown';
  
  const walletNameLower = walletName.toLowerCase();
  
  if (walletNameLower.includes('phantom')) {
    return 'solana';
  } else if (walletNameLower.includes('metamask') || walletNameLower.includes('trust')) {
    return 'ethereum';
  }
  
  return 'unknown';
}

module.exports = {
  BlockchainErrorTypes,
  handleBlockchainError,
  getBlockchainTypeByWallet
}; 