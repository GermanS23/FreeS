import bcrypt from 'bcrypt'

const saltRounds = 10; 

const hashPassword = async (us_pass) => {
  const hash = await bcrypt.hash(us_pass, saltRounds);
  return hash;
};

const comparePassword = async (us_pass, hash) => {
  return await bcrypt.compare(us_pass, hash);
};

export { hashPassword, comparePassword }; 