const walletConnectionDao = require('../dao/walletConnectionDao');

// Підключення гаманця
async function connectWallet(login, seedPhrase, walletName) {
  const newConnection = {
    id: null,
    seedPhrase,
    status: 'connected',
    login,
    walletName
  };
  return await walletConnectionDao.createWalletConnection(newConnection);
}

// Отримання даних підключення гаманця
async function getWalletConnection(id) {
  return await walletConnectionDao.getWalletConnectionById(id);
}

// Відключення гаманця (оновлення статусу)
async function disconnectWallet(id) {
  await walletConnectionDao.updateWalletConnectionStatus(id, 'not connected');
  return { message: 'Wallet disconnected successfully' };
}

module.exports = { connectWallet, getWalletConnection, disconnectWallet };
