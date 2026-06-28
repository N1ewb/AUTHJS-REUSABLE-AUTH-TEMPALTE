import { getNotifications } from "@/actions/client/notification.action";
import NotificationsClient from "./NotificationsPage";

export default async function NotificationsPage() {
  const notifications = await getNotifications();

  return <NotificationsClient notifications={notifications} />;
}
