const walletDao = require('../dao/walletDao');
const userDao = require('../dao/userDao');
const { handleBlockchainError, getBlockchainTypeByWallet } = require('../utils/blockchainErrorHandler');

// Перевірка формату Seed Phrase
function validateSeedPhrase(seedPhrase) {
  if (!seedPhrase) {
    throw new Error('Seed Phrase не може бути порожнім');
  }

  const words = seedPhrase.trim().split(/\s+/);
  const validLengths = [12, 18, 24];

  if (!validLengths.includes(words.length)) {
    throw new Error('Seed Phrase повинен містити 12, 18 або 24 слова');
  }

  // Додаткова перевірка на словник BIP-39 можна додати при необхідності
  return true;
}

// Перевірка, чи підключено гаманець
async function isWalletConnected(login) {
  try {
    const wallet = await walletDao.getWalletByLogin(login);
    return wallet && wallet.status === 'connected';
  } catch (error) {
    console.error('Помилка при перевірці підключення гаманця:', error);
    return false;
  }
}

// Підключення гаманця
async function connectWallet(login, seedPhrase, walletName) {
  try {
    // Валідація seed phrase вже виконана в контролері
    return await walletDao.saveWallet(login, seedPhrase, walletName, 'connected');
  } catch (error) {
    const blockchainType = getBlockchainTypeByWallet(walletName);
    const processedError = handleBlockchainError(error, blockchainType);
    console.error(`Помилка підключення гаманця [${processedError.type}]:`, processedError.message);
    // Можна зберігати інформацію про помилку підключення (як у вашій логіці)
    throw {
      message: processedError.message,
      type: processedError.type,
      code: processedError.code,
      details: processedError.details
    };
  }
}

// Новий метод для Dapp-підключення (без seed phrase)
async function connectWalletDapp(login, walletName) {
  // Для Dapp, на стороні клієнта буде виконано підключення через розширення/модуль,
  // тому ми просто оновлюємо/створюємо запис у БД без seed phrase.
  return await walletDao.saveWallet(login, null, walletName, 'connected');
}

// Валідація seed phrase
async function validateSeedPhrase(seedPhrase, walletName) {
  try {
    if (!seedPhrase) {
      throw new Error('Seed phrase не може бути порожньою');
    }
    
    // Базова валідація кількості слів
    const words = seedPhrase.trim().split(/\s+/);
    if (![12, 18, 24].includes(words.length)) {
      throw new Error(`Недійсна seed phrase: має бути 12, 18 або 24 слова. Отримано: ${words.length}`);
    }
    
    // Додаткова валідація для Solana (Phantom)
    if (walletName?.toLowerCase().includes('phantom')) {
      await validateSolanaSeedPhrase(seedPhrase);
    }
    
    // Додаткова валідація для Ethereum (MetaMask, TrustWallet)
    if (walletName?.toLowerCase().includes('metamask') || walletName?.toLowerCase().includes('trust')) {
      await validateEthereumSeedPhrase(seedPhrase);
    }
    
    return true;
  } catch (error) {
    const blockchainType = getBlockchainTypeByWallet(walletName);
    const processedError = handleBlockchainError(error, blockchainType);
    throw processedError;
  }
}

// Валідація Solana seed phrase
async function validateSolanaSeedPhrase(seedPhrase) {
  try {
    // Тут має бути код для перевірки seed phrase через Solana API
    // Для прикладу, ми просто імітуємо перевірку
    const words = seedPhrase.split(/\s+/);
    
    // Перевірка на BIP39 словник (спрощено)
    const isBIP39Valid = true; // Тут має бути реальна перевірка
    
    if (!isBIP39Valid) {
      throw new Error('seed phrase contains invalid BIP39 words');
    }
    
    return true;
  } catch (error) {
    const processedError = handleBlockchainError(error, 'solana');
    throw processedError;
  }
}

// Валідація Ethereum seed phrase
async function validateEthereumSeedPhrase(seedPhrase) {
  try {
    // Тут має бути код для перевірки seed phrase через Ethereum API
    // Для прикладу, ми просто імітуємо перевірку
    const words = seedPhrase.split(/\s+/);
    
    // Перевірка на BIP39 словник (спрощено)
    const isBIP39Valid = true; // Тут має бути реальна перевірка
    
    if (!isBIP39Valid) {
      throw new Error('seed phrase contains invalid BIP39 words');
    }
    
    return true;
  } catch (error) {
    const processedError = handleBlockchainError(error, 'ethereum');
    throw processedError;
  }
}

// Отримання балансу гаманця
async function getWalletBalance(login) {
  try {
    const wallet = await walletDao.getWalletByLogin(login);
    
    if (!wallet || wallet.status !== 'connected') {
      throw new Error('Гаманець не підключено');
    }
    
    // Визначаємо тип блокчейну за типом гаманця
    const blockchainType = getBlockchainTypeByWallet(wallet.walletName);
    
    // Отримання балансу в залежності від типу блокчейну
    let balance;
    
    if (blockchainType === 'solana') {
      balance = await getSolanaBalance(wallet.seedPhrase);
    } else if (blockchainType === 'ethereum') {
      balance = await getEthereumBalance(wallet.seedPhrase);
    } else {
      throw new Error('Непідтримуваний тип гаманця');
    }
    
    return {
      balance,
      currency: blockchainType === 'solana' ? 'SOL' : 'ETH'
    };
  } catch (error) {
    const wallet = await walletDao.getWalletByLogin(login);
    const blockchainType = getBlockchainTypeByWallet(wallet?.walletName);
    const processedError = handleBlockchainError(error, blockchainType);
    
    console.error(`Помилка отримання балансу [${processedError.type}]:`, processedError.message);
    
    throw {
      message: processedError.message,
      type: processedError.type,
      code: processedError.code
    };
  }
}

// Отримання балансу Solana
async function getSolanaBalance(seedPhrase) {
  try {
    // Тут має бути реальна реалізація через @solana/web3.js
    return 10.5; // Тестове значення
  } catch (error) {
    const processedError = handleBlockchainError(error, 'solana');
    throw processedError;
  }
}

// Отримання балансу Ethereum
async function getEthereumBalance(seedPhrase) {
  try {
    // Тут має бути реальна реалізація через web3.js або ethers.js
    return 0.25; // Тестове значення
  } catch (error) {
    const processedError = handleBlockchainError(error, 'ethereum');
    throw processedError;
  }
}

// Відключення гаманця
async function disconnectWallet(login) {
  try {
    const wallet = await walletDao.getWalletByLogin(login);
    
    if (!wallet) {
      throw new Error('У цього користувача немає підключеного гаманця');
    }
    
    return await walletDao.updateWalletStatus(login, 'disconnected');
  } catch (error) {
    console.error('Помилка при відключенні гаманця:', error);
    throw error;
  }
}

module.exports = {
  isWalletConnected,
  connectWallet,
  connectWalletDapp, // додано новий метод
  getWalletBalance,
  disconnectWallet,
  validateSeedPhrase
};