import { useCallback, useEffect, useState } from "react";
import { Button, Center, Image, Input, Text, VStack } from "@chakra-ui/react";
import { SceneKeys } from "constants/scenes";
import withSceneMatched from "libs/withSceneMatched";
import { useAppDispatch } from "state";
import { goto } from "state/scene";
import logo from "assets/images/logo.png";
import Web3 from "web3";
import { setOrigin } from "state/player";
import { select } from "state/map";
import { serialize } from "libs/coordinates";

const Register = withSceneMatched([SceneKeys.REGISTER])(() => {
  const dispatch = useAppDispatch();
  const [nickname, setNickname] = useState("");
  const provider = (window as any).ethereum;

  const createUser = useCallback(
    (address: string) => {
      // @todo: update algorithm
      const q = parseInt(address.slice(2, 22), 16) % (1e7 + 7);
      const r = parseInt(address.slice(22), 16) % (1e7 + 7);
      dispatch(setOrigin({ q, r }));
      dispatch(select(serialize(q, r)));
      dispatch(goto(SceneKeys.MAP));
    },
    [dispatch]
  );

  const onConnect = useCallback(async () => {
    const addresses = await provider.request({ method: "eth_requestAccounts" });
    createUser(addresses[0]);
  }, [createUser, provider]);

  const onRegister = useCallback(() => {
    if (!nickname) return;
    // Initialize web3 instance
    const web3 = new Web3();

    // Generate an account with a seed
    const seed = web3.utils.sha3(nickname);
    if (!seed) return;
    const account = web3.eth.accounts.privateKeyToAccount(seed);
    createUser(account.address);
  }, [createUser, nickname]);

  // auto connect
  useEffect(() => {
    if (provider) onConnect();
  }, [onConnect, provider]);

  return (
    <Center
      width="100vw"
      height="100vh"
      pointerEvents="auto"
      bg="radial-gradient(circle at center, white 0, #cccccc 30%, #333333 100%)"
    >
      <VStack>
        <Image src={logo} />
        <Input
          placeholder="Nick name"
          border="1px solid #aaaaaa"
          my={2}
          bg="#e3e3e3"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
        <Button colorScheme="orange" width="100%" onClick={onRegister}>
          Register
        </Button>
        {provider && (
          <>
            <Text fontSize="xl">or</Text>
            <Button colorScheme="teal" onClick={onConnect} width="100%">
              Connect Wallet
            </Button>
          </>
        )}
      </VStack>
    </Center>
  );
});

export default Register;
