import { Heading, Text } from "@chakra-ui/react";
import axios from "axios";
import { useEffect } from "react";
import { useActionData, useSubmit } from "react-router-dom";

/** @type {import("react-router-dom").ActionFunction} */
export const changeEmailAction = async ({ params }) => {
  try {
    const res = await axios.patch(
      `http://localhost:8000/api/v1/users/${params?.token}`
    );
    return res.data;
  } catch (err) {
    return err.response.data;
  }
};

const ChangeEmailPage = () => {
  const submit = useSubmit();
  const actionData = useActionData();

  useEffect(() => {
    submit(null, { method: "patch" });
  }, [submit]);

  return (
    <>
      <Heading>Ubah Alamat Surel</Heading>
      <Text>
        {actionData?.success
          ? actionData?.msg
          : "Error: " + JSON.stringify(actionData?.errors)}
      </Text>
    </>
  );
};

export default ChangeEmailPage;
