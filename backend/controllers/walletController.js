const walletService = require('../services/walletService');
const walletDao = require('../dao/walletDao');

// Підключення гаманця
async function connectWallet(req, res) {
  try {
    const { login } = req.user;
    const { seedPhrase, walletName, connectionType } = req.body;

    if (!walletName) {
      return res.status(400).json({ success: false, error: 'Необхідно вказати назву гаманця' });
    }
    if (!connectionType || !['dapp', 'seedPhrase'].includes(connectionType)) {
      return res.status(400).json({ success: false, error: 'Некоректний тип підключення. Повинен бути "dapp" або "seedPhrase".' });
    }

    let wallet;
    if (connectionType === 'seedPhrase') {
      if (!seedPhrase) {
        return res.status(400).json({ success: false, error: 'Seed phrase не може бути порожнім' });
      }
      // Виконуємо валідацію seed phrase
      await walletService.validateSeedPhrase(seedPhrase, walletName);
      wallet = await walletService.connectWallet(login, seedPhrase, walletName);
    } else if (connectionType === 'dapp') {
      // Для dapp-підключення seed phrase не потрібен
      wallet = await walletService.connectWalletDapp(login, walletName);
    }

    return res.status(200).json({
      success: true,
      wallet: {
        login: wallet.login,
        walletName: wallet.walletName,
        status: wallet.status,
        createdAt: wallet.createdAt,
        updatedAt: wallet.updatedAt
      }
    });
  } catch (error) {
    if (error.type && error.code) {
      return res.status(error.code).json({
        success: false,
        error: error.message,
        errorType: error.type,
        details: error.details
      });
    }
    return res.status(400).json({
      success: false,
      error: error.message || 'Помилка при підключенні гаманця'
    });
  }
}

// Отримання балансу гаманця
async function getWalletBalance(req, res) {
  try {
    const { login } = req.user;
    
    const balance = await walletService.getWalletBalance(login);
    
    return res.status(200).json({
      success: true,
      balance: balance.balance,
      currency: balance.currency
    });
  } catch (error) {
    // Перевіряємо, чи має помилка спеціальну структуру від обробника блокчейн помилок
    if (error.type && error.code) {
      return res.status(error.code).json({
        success: false,
        error: error.message,
        errorType: error.type,
        details: error.details
      });
    }
    
    return res.status(400).json({
      success: false,
      error: error.message || 'Помилка при отриманні балансу гаманця'
    });
  }
}

// Відключення гаманця
async function disconnectWallet(req, res) {
  try {
    const { login } = req.user;
    
    await walletService.disconnectWallet(login);
    
    return res.status(200).json({
      success: true
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message || 'Помилка при відключенні гаманця'
    });
  }
}

// Перевірка статусу підключення гаманця
async function getWalletStatus(req, res) {
  try {
    const { login } = req.user;
    
    const isConnected = await walletService.isWalletConnected(login);
    
    if (!isConnected) {
      return res.status(200).json({
        success: true,
        isConnected: false
      });
    }
    
    const wallet = await walletDao.getWalletByLogin(login);
    
    return res.status(200).json({
      success: true,
      isConnected: true,
      wallet: {
        walletName: wallet.walletName,
        status: wallet.status
      }
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message || 'Помилка при перевірці статусу гаманця'
    });
  }
}

// Отримання історії помилок підключення гаманця
async function getWalletConnectionErrors(req, res) {
  try {
    const { login } = req.user;
    
    const errors = await walletDao.getWalletConnectionErrors(login);
    
    return res.status(200).json({
      success: true,
      errors
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message || 'Помилка при отриманні історії помилок підключення гаманця'
    });
  }
}

module.exports = {
  connectWallet,
  getWalletBalance,
  disconnectWallet,
  getWalletStatus,
  getWalletConnectionErrors
};