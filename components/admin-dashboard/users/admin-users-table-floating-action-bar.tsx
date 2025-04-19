"use client";
import { type Table } from "@tanstack/react-table";
import {
  CheckCircle2,
  Download,
  Loader,
  UserMinus2,
  UserPlus2,
  X,
} from "lucide-react";
import { ToastAction } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Portal } from "@/components/ui/portal";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Kbd } from "@/components/ui/kbd";
import { exportTableToCSV } from "@/lib/utils/export/export";
import { useToast } from "@/hooks/use-toast";
import { TAdminDashboardUsersColumns } from "./admin-users-table-columns";
import { makeAdmin, removeAdmin } from "@/lib/actions/user/admin/admin";
import { deleteUser } from "@/lib/actions/user/user";
import { useEffect, useState, useTransition } from "react";

interface TableFloatingBarProps<TData> {
  table: Table<TData>;
}

export function AdminDashboardUsersFloatingActionBar<TData>({
  table,
}: TableFloatingBarProps<TData>) {
  const rows = table.getFilteredSelectedRowModel().rows;

  const [isPending, startTransition] = useTransition();
  const [action, setAction] = useState<
    "update-role" | "delete-user" | "export"
  >();
  const { toast } = useToast();

  // Clear selection on Escape key press
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        table.toggleAllRowsSelected(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [table]);

  return (
    <Portal>
      <div className="fixed inset-x-0 bottom-6 z-50 mx-auto w-fit px-2.5">
        <div className="w-full overflow-x-auto">
          <div className="mx-auto flex w-fit items-center gap-2 rounded-md border bg-background p-2 text-foreground shadow">
            <div className="flex h-7 items-center rounded-md border border-dashed pl-2.5 pr-1">
              <span className="whitespace-nowrap text-xs">
                {rows.length > 1
                  ? `${rows.length} selected`
                  : `Booking ${(rows[0].original as TAdminDashboardUsersColumns).id}`}
              </span>
              <Separator orientation="vertical" className="ml-2 mr-1" />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-5 hover:border"
                    onClick={() => table.toggleAllRowsSelected(false)}
                  >
                    <X className="size-3.5 shrink-0" aria-hidden="true" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="flex items-center border bg-accent px-2 py-1 font-semibold text-foreground dark:bg-zinc-900">
                  <p className="mr-2">Clear selection</p>
                  <Kbd abbrTitle="Escape" variant="outline">
                    Esc
                  </Kbd>
                </TooltipContent>
              </Tooltip>
            </div>
            <Separator orientation="vertical" className="hidden h-5 sm:block" />
            <div className="flex items-center gap-1.5">
              {/* to update role to admin */}
              {rows.length === 1 &&
                ((rows[0].original as TAdminDashboardUsersColumns).role !==
                "Admin" ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="size-7 border"
                        onClick={() => {
                          setAction("update-role");

                          startTransition(async () => {
                            if (
                              (rows[0].original as TAdminDashboardUsersColumns)
                                .role === "User"
                            ) {
                              const role = await makeAdmin(
                                (
                                  rows[0]
                                    .original as TAdminDashboardUsersColumns
                                ).id
                              );

                              if (role === "User") {
                                toast({
                                  title: "Error Updating Role",
                                  description:
                                    "User role cannot be updated. Please try again.",
                                  variant: "destructive",
                                });
                                return;
                              } else {
                                toast({
                                  title: "User Role Updated",
                                  description: `Updated ${(rows[0].original as TAdminDashboardUsersColumns).firstName} ${(rows[0].original as TAdminDashboardUsersColumns).lastName} role to: ${role}`,
                                });
                              }
                            }
                          });
                        }}
                        disabled={isPending || rows.length !== 1}
                      >
                        {isPending && action === "update-role" ? (
                          <Loader
                            className="size-3.5 animate-spin"
                            aria-hidden="true"
                          />
                        ) : (
                          <UserPlus2 className="size-3.5" aria-hidden="true" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="border bg-accent font-semibold text-foreground dark:bg-zinc-900">
                      <p>Update User&apos;s Role to Admin</p>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  // Content for when role is Admin
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="size-7 border"
                        onClick={() => {
                          setAction("update-role");

                          startTransition(async () => {
                            if (
                              (rows[0].original as TAdminDashboardUsersColumns)
                                .role === "Admin"
                            ) {
                              const role = await removeAdmin(
                                (
                                  rows[0]
                                    .original as TAdminDashboardUsersColumns
                                ).id
                              );

                              if (role === "Admin") {
                                toast({
                                  title: "Error Revoking Admin Role",
                                  description:
                                    "User role cannot be updated. Please try again.",
                                  variant: "destructive",
                                });
                                return;
                              } else {
                                toast({
                                  title: "User Role Updated",
                                  description: `Revoked ${(rows[0].original as TAdminDashboardUsersColumns).firstName} ${(rows[0].original as TAdminDashboardUsersColumns).lastName} role to: ${role}`,
                                });
                              }
                            }
                          });
                        }}
                        disabled={isPending || rows.length !== 1}
                      >
                        {isPending && action === "update-role" ? (
                          <Loader
                            className="size-3.5 animate-spin"
                            aria-hidden="true"
                          />
                        ) : (
                          <UserMinus2 className="size-3.5" aria-hidden="true" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="border bg-accent font-semibold text-foreground dark:bg-zinc-900">
                      <p>Revoke User&apos;s Admin Role</p>
                    </TooltipContent>
                  </Tooltip>
                ))}

              {/* Delete User */}
              {rows.length === 1 && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="size-7 border"
                      onClick={() => {
                        setAction("delete-user");

                        startTransition(async () => {
                          const user = await deleteUser(
                            (rows[0].original as TAdminDashboardUsersColumns)
                              .clerkId
                          );

                          if (user.isDeleted) {
                            toast({
                              title: "User Deleted Successfully",
                              description:
                                "User has been deleted successfully.",
                            });
                            return;
                          } else {
                            toast({
                              variant: "destructive",
                              title: "Error Deleting User",
                              description: `User cannot be deleted. Please try again.`,
                            });
                          }
                        });
                      }}
                      disabled={
                        isPending ||
                        (rows[0].original as TAdminDashboardUsersColumns)
                          .isDeleted ||
                        rows.length !== 1
                      }
                    >
                      {isPending && action === "update-role" ? (
                        <Loader
                          className="size-3.5 animate-spin"
                          aria-hidden="true"
                        />
                      ) : (
                        <UserMinus2 className="size-3.5" aria-hidden="true" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="border bg-accent font-semibold text-foreground dark:bg-zinc-900">
                    <p>Delete User</p>
                  </TooltipContent>
                </Tooltip>
              )}

              {/* to export mulitple rows or single row from a DataTable*/}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="size-7 border"
                    onClick={() => {
                      setAction("export");

                      startTransition(() => {
                        exportTableToCSV(table, {
                          excludeColumns: ["select", "actions"],
                          onlySelected: true,
                        });
                        toast({
                          title: "Export completed",
                          description:
                            "Your data has been exported successfully",
                          action: (
                            <ToastAction
                              altText="Try again"
                              className="flex items-center gap-1 text-primary"
                            >
                              <CheckCircle2 className="size-4" />
                              Done
                            </ToastAction>
                          ),
                        });
                      });
                    }}
                    disabled={isPending}
                  >
                    {isPending && action === "export" ? (
                      <Loader
                        className="size-3.5 animate-spin"
                        aria-hidden="true"
                      />
                    ) : (
                      <Download className="size-3.5" aria-hidden="true" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="border bg-accent font-semibold text-foreground dark:bg-zinc-900">
                  <p>Export .CSV</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
}
