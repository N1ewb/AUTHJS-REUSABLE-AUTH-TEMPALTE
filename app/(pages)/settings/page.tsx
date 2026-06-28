import { getSettings } from "@/actions/client/user.action";
import SettingsClient from "./SettingsClient";

export default async function SettingsPage() {
  const settings = await getSettings();

  return <SettingsClient settings={settings} />;
}
