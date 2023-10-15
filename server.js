const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { Keypair, Connection, PublicKey, Transaction, sendAndConfirmTransaction, SystemProgram } = require('@solana/web3.js');

const app = express();
const port = 3000;

// CORS ayarları
app.use(cors());

// Solana bağlantısı oluşturma
const connection = new Connection('https://api.devnet.solana.com', "confirmed");

app.use(express.json()); // JSON verileri işlemek için body-parser eklentisini kullanıyoruz.

app.post('/sendTransaction', async (req, res) => {
    try {
        // Gönderen cüzdan adresi
        // Özel anahtarınızı buraya atayın
        const secret = process.env.SECRET_KEY.split(',').map(Number);
        // Replace with your secret key

        const from = Keypair.fromSecretKey(new Uint8Array(secret));

        // Alıcı cüzdan adresi
        const toWallet = new PublicKey(req.body.toWallet);

        console.log(from)
        // Transfer miktarı
        const lamports = 1e9; //100000 Örneğin, 0.001 SOL
        const amountInLamports = Number(req.body.amountInLamports); // body den gelen tutarı kabul etmiyor
        console.log("amountInLamports", amountInLamports);


        console.log(req.body); // Eklenen satır

        // Transfer işlemi oluşturma
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: from.publicKey,
                toPubkey: toWallet,
                lamports: lamports * amountInLamports
            })
        );

        // Transfer işlemi gönderme
        const signature = await sendAndConfirmTransaction(connection, transaction, [from]);


        res.send(`İşlem başarıyla gönderildi. İmza: ${signature}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('İşlem gönderirken bir hata oluştu');

    }
});

app.listen(port, () => {
    console.log(`Uygulama ${port} numaralı portta çalışıyor`);
});
