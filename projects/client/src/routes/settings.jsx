import {
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import ProfilePanel from "../components/ProfilePanel";

// /** @type {import("react-router-dom").LoaderFunction} */
// export const settingsLoader = async ({ request, context }) => {
//   try {
//     console.log("context: ", context);
//     // const res = await axios.get(`http://localhost:8000/api/v1/users/{}`);
//     return null;
//   } catch (err) {
//     return err.response.data;
//   }
// };

// /** @type {import("react-router-dom").ActionFunction} */
// export const settingsAction = async ({ request }) => {
//   try {
//     const res = await axios.patch(
//       `http://localhost:8000/api/v1/users/{}`,
//       Object.fromEntries(await request.formData()),
//       { headers: { "Content-Type": "application/json" }, withCredentials: true }
//     );
//     return res.data;
//   } catch (err) {
//     return err.response.data;
//   }
// };

const SettingsPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Heading>Pengaturan</Heading>
      <Tabs isFitted>
        <TabList>
          <Tab>Profil</Tab>
          <Tab
            onClick={() => {
              navigate("/settings/address");
            }}
          >
            Alamat
          </Tab>
        </TabList>
        <TabPanels>
          <ProfilePanel />
          <TabPanel></TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};

export default SettingsPage;
