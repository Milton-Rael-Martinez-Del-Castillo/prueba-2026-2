import { redirect } from "next/navigation";
import { isRestauranteAuthenticated } from "../../lib/restaurante-auth";
import RestauranteDashboard from "./components/RestauranteDashboard";

export default async function RestaurantePage() {
  if (!(await isRestauranteAuthenticated())) {
    redirect("/restaurante/login");
  }

  return <RestauranteDashboard />;
}
