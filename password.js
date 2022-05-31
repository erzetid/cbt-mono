import bcrypt from 'bcrypt';

const generatePassword = async () => {
  const plainPassword = process.argv.slice(2);
  if (!plainPassword.length) {
    return console.log('Password tidak boleh kosong');
  }
  const salt = bcrypt.genSaltSync(10);
  const password = bcrypt.hashSync(plainPassword[0], salt);

  console.log(`teks: ${plainPassword[0]}`);
  console.log(`password: ${password}`);
};
generatePassword();

// TODO backend validasi kelas jika sudah di pakai
// TODO validai add soal max jumlah
