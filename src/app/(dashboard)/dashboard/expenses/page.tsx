import { getAllTeamExpenses } from "@/actions/expenses";
import { getUser, getUserWithTeam } from "@/actions/user";
import { DateRangeProvider } from "@/components/dashboard/date-range-context";
import { redirect } from "next/navigation";
import { ExpenseBarChart } from "./expense-bar-chart";
import { ExpenseFilter, ExpenseFilterProvider } from "./expense-filter";
import { ExpensePieChart } from "./expense-pie-chart";
import { ExpenseTable } from "./expense-table";
import { ExpenseAreaChartSkeleton } from "./skeletons/expense-area-chart-skeleton";
import { ExpensePieChartSkeleton } from "./skeletons/expense-pie-chart-skeleton";
import { ExpenseTableSkeleton } from "./skeletons/expense-table-skeleton";

export default async function Dashboard() {
  const user = await getUser();
  if (!user) {
    redirect("/sign-in");
  }

  const userWithTeam = await getUserWithTeam(user.id);
  if (!userWithTeam) {
    redirect("/sign-in");
  }

  const expenses = await getAllTeamExpenses(user.id);

  return (
    <DateRangeProvider>
      <ExpenseFilterProvider>
        <div className="flex min-h-screen w-full flex-col bg-muted/40 relative overflow-y-auto">
          <div className="flex flex-col sm:gap-4 sm:py-4">
            <main className="relative flex-1 gap-4 px-4 sm:px-6 items-center md:gap-8 ">
              <ExpenseFilter />

              <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 items-end ">
                  <div className="sm:col-span-2">
                    {userWithTeam.teamId ? (
                      <ExpenseBarChart
                        totalRevenue={1000000}
                        expenses={expenses}
                        teamId={userWithTeam.teamId}
                      />
                    ) : (
                      <ExpenseAreaChartSkeleton />
                    )}
                  </div>

                  <div className="sm:col-span-1 w-full h-full">
                    {userWithTeam.teamId ? (
                      <ExpensePieChart
                        totalRevenue={1000000}
                        expenses={expenses}
                        teamId={userWithTeam.teamId}
                      />
                    ) : (
                      <ExpensePieChartSkeleton />
                    )}
                  </div>
                </div>

                {userWithTeam.teamId ? (
                  <ExpenseTable
                    totalRevenue={1000000}
                    expenses={expenses}
                    teamId={userWithTeam.teamId}
                  />
                ) : (
                  <ExpenseTableSkeleton />
                )}
              </div>
              <div></div>
            </main>
          </div>
        </div>
      </ExpenseFilterProvider>
    </DateRangeProvider>
  );
}
