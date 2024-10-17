import bcrypt from "bcrypt";

const testBcrypt = async () => {
  const password = "password123";
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("Hashed Password:", hashedPassword);

  const valid = await bcrypt.compare(password, hashedPassword);
  if (!valid) {
    console.error("Invalid password");
    throw new Error("Invalid password");
  }
  console.log("Password is valid");
};

testBcrypt();
