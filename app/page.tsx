"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronDown,
  Plus,
  Settings,
  Trash2,
  Info,
  Loader2,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  BarChart3,
  PlayCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  CheckCheck,
  MoreHorizontal,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Project, ProjectStatus } from "./types/types";

const steps = [
  { number: 1, title: "Create Project" },
  { number: 2, title: "Integration" },
  { number: 3, title: "Posthog Integration" },
];

export default function AutoPlayProjectDashboard() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalProjectId, setModalProjectId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | ProjectStatus>(
    "all"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [currentStep, setCurrentStep] = useState(3);
  const [selectedProject, setSelectedProject] = useState("Default Project");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsProjectId, setSettingsProjectId] = useState<string | null>(
    null
  );
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null);
  const [description, setDescription] = useState(
    "My default project description"
  );

  const [editProjectName, setEditProjectName] = useState("");
  const [editProjectDescription, setEditProjectDescription] = useState("");

  const [integrationTab, setIntegrationTab] = useState("existing");
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const [addProjectOpen, setAddProjectOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [projectId, setProjectId] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [codeSnippetsExpanded, setCodeSnippetsExpanded] = useState<{
    [key: string]: boolean;
  }>({});
  const [showAdvanced, setShowAdvanced] = useState(false);

  const maxDescriptionLength = 255;

  const [projects, setProjects] = useState<Project[]>([
    {
      id: "project-1",
      name: "Default Project",
      description: "My default project description",
      status: "pending" as ProjectStatus,
    },
    {
      id: "project-2",
      name: "Production App",
      description: "Main production application",
      status: "completed" as ProjectStatus,
    },
    {
      id: "project-3",
      name: "Staging Environment",
      description: "Testing environment for new features",
      status: "failed" as ProjectStatus,
    },
    {
      id: "project-4",
      name: "Development Setup",
      description: "Local development environment",
      status: "completed" as ProjectStatus,
    },
    {
      id: "project-5",
      name: "Beta Testing",
      description: "Beta testing environment for early adopters",
      status: "pending" as ProjectStatus,
    },
    {
      id: "project-6",
      name: "Mobile App",
      description: "Mobile application tracking",
      status: "completed" as ProjectStatus,
    },
    {
      id: "project-7",
      name: "Analytics Dashboard",
      description: "Internal analytics dashboard",
      status: "failed" as ProjectStatus,
    },
    {
      id: "project-8",
      name: "E-commerce Store",
      description: "Main e-commerce platform",
      status: "completed" as ProjectStatus,
    },
    {
      id: "project-9",
      name: "Marketing Site",
      description: "Marketing and landing pages",
      status: "completed" as ProjectStatus,
    },
    {
      id: "project-10",
      name: "Customer Portal",
      description: "Customer self-service portal",
      status: "pending" as ProjectStatus,
    },
    {
      id: "project-11",
      name: "Admin Panel",
      description: "Internal admin management system",
      status: "completed" as ProjectStatus,
    },
    {
      id: "project-12",
      name: "API Gateway",
      description: "API gateway monitoring",
      status: "completed" as ProjectStatus,
    },
  ]);

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProjects = filteredProjects.slice(startIndex, endIndex);

  const selectProject = (id: string) => {
    setModalProjectId(id);
    setModalOpen(true);
  };

  const modalProjectData = projects.find((p) => p.id === modalProjectId);
  const settingsProjectData = projects.find((p) => p.id === settingsProjectId);
  const deleteProjectData = projects.find((p) => p.id === deleteProjectId);

  const handleOpenSettings = (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    const project = projects.find((p) => p.id === projectId);
    if (!project) return;

    setSettingsProjectId(projectId);
    setEditProjectName(project.name);
    setEditProjectDescription(project.description);
    setSettingsOpen(true);
  };

  const handleOpenDeleteConfirm = (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteProjectId(projectId);
    setDeleteConfirmOpen(true);
  };

  const handleContinueIntegration = (
    projectId: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    selectProject(projectId);
  };

  const handleSetActiveProject = (projectName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedProject(projectName);
    toast({
      title: "Active Project Changed",
      description: `${projectName} is now your active project.`,
    });
  };

  const handleSaveProjectSettings = () => {
    if (!settingsProjectId) return;

    setProjects((prev) =>
      prev.map((project) =>
        project.id === settingsProjectId
          ? {
              ...project,
              name: editProjectName.trim(),
              description: editProjectDescription.trim(),
            }
          : project
      )
    );

    // Update active project name if renamed
    if (selectedProject === settingsProjectData?.name) {
      setSelectedProject(editProjectName.trim());
    }

    toast({
      title: "Project Updated",
      description: "Project details updated successfully.",
    });

    setSettingsOpen(false);
  };

  const handleDeleteProject = () => {
    if (!deleteProjectId) return;

    setProjects((prev) =>
      prev.filter((project) => project.id !== deleteProjectId)
    );

    toast({
      title: "Project Deleted",
      description: `${deleteProjectData?.name} has been deleted successfully.`,
    });

    setDeleteConfirmOpen(false);
    setDeleteProjectId(null);

    // Close modal if deleted project was open
    if (modalProjectId === deleteProjectId) {
      setModalOpen(false);
      setModalProjectId(null);
    }
  };

  const handleAddProject = () => {
    if (!newProjectName.trim()) {
      toast({
        variant: "destructive",
        title: "Project name required",
        description: "Please enter a project name.",
      });
      return;
    }

    const newProject: Project = {
      id: `project-${Date.now()}`,
      name: newProjectName,
      description: newProjectDescription || "No description",
      status: "pending",
    };

    setProjects((prev) => [newProject, ...prev]);

    toast({
      title: "Project Created",
      description: `${newProjectName} has been added successfully.`,
    });

    // Reset & close
    setNewProjectName("");
    setNewProjectDescription("");
    setAddProjectOpen(false);
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    setConnectionStatus("loading");

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Simulate failure for demo
    const success = Math.random() > 0.5;

    if (success) {
      setConnectionStatus("success");
      toast({
        title: "Connection Successful",
        description: "Your account has been connected successfully.",
      });
    } else {
      setConnectionStatus("error");
      toast({
        variant: "destructive",
        title: "Connection Failed",
        description:
          "Invalid API key or insufficient permissions. Please try again.",
      });
    }

    setIsConnecting(false);
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const toggleCodeSnippet = (key: string) => {
    setCodeSnippetsExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const getStatusBadge = (status: ProjectStatus) => {
    switch (status) {
      case "pending":
        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="secondary" className="gap-1.5">
                <Clock className="h-3 w-3" />
                Pending
              </Badge>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p className="text-sm">Please integrate the posthog.</p>
            </TooltipContent>
          </Tooltip>
        );
      case "completed":
        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge
                variant="default"
                className="gap-1.5 bg-green-600 hover:bg-green-700"
              >
                <CheckCircle2 className="h-3 w-3" />
                Completed
              </Badge>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p className="text-sm">posthog integrated sucessfully</p>
            </TooltipContent>
          </Tooltip>
        );
      case "failed":
        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="destructive" className="gap-1.5">
                <XCircle className="h-3 w-3" />
                Failed
              </Badge>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p className="text-sm">posthig integration failed.</p>
            </TooltipContent>
          </Tooltip>
        );
    }
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          variant={currentPage === i ? "default" : "outline"}
          size="sm"
          onClick={() => setCurrentPage(i)}
          className="h-8 w-8 p-0"
        >
          {i}
        </Button>
      );
    }

    return pages;
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold tracking-tight sm:text-3xl">
              Projects
            </h1>
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="gap-2 bg-transparent text-xs sm:text-sm"
                  >
                    {selectedProject}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem
                    onClick={() => setSelectedProject("Default Project")}
                  >
                    Default Project
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setSelectedProject("Production App")}
                  >
                    Production App
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button className="gap-2" onClick={() => setAddProjectOpen(true)}>
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">New Project</span>
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Input
              placeholder="Search projects by name or description..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="max-w-md"
            />
            <Tabs
              value={statusFilter}
              onValueChange={(v) => {
                setStatusFilter(v as typeof statusFilter);
                setCurrentPage(1);
              }}
            >
              <TabsList>
                <TabsTrigger value="all">All Projects</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="failed">Failed</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Projects Table */}
          <Card>
            <CardHeader>
              <CardTitle>Project List</CardTitle>
              <CardDescription>
                Manage your AutoPlay projects and integrations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedProjects.map((project) => {
                    const isActiveProject = selectedProject === project.name;
                    return (
                      <TableRow
                        key={project.id}
                        onClick={() => selectProject(project.id)}
                        className={`cursor-pointer transition-colors
    ${isActiveProject ? "bg-muted text-tertiary" : "hover:bg-muted/30"}
  `}
                      >
                        <TableCell className="max-w-56">
                          <span className="font-medium truncate block">
                            {project.name}
                          </span>
                        </TableCell>
                        <TableCell className="text-muted-foreground max-w-99">
                          <span className="truncate block">
                            {" "}
                            {project.description}
                          </span>
                        </TableCell>
                        <TableCell>{getStatusBadge(project.status)}</TableCell>

                        <TableCell
                          className="text-right"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                              {/* Always available actions */}
                              <DropdownMenuItem
                                onClick={(e) =>
                                  handleOpenSettings(project.id, e)
                                }
                              >
                                <Settings className="mr-2 h-4 w-4" />
                                Project Settings
                              </DropdownMenuItem>

                              {/* Conditional: Show delete, but disable if only project */}
                              {projects.length === 1 || isActiveProject ? (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div>
                                      <DropdownMenuItem
                                        disabled
                                        className="opacity-50 cursor-not-allowed text-red-400"
                                      >
                                        <Trash2
                                          className="mr-2 h-4 w-4"
                                          color="#D25B5B"
                                        />
                                        Delete Project
                                      </DropdownMenuItem>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent
                                    side="left"
                                    className="max-w-xs"
                                  >
                                    <p className="text-sm">
                                      {isActiveProject
                                        ? "You cannot delete the active project. Please switch to another project first."
                                        : "To delete this project, first create a new one."}
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              ) : (
                                <DropdownMenuItem
                                  onClick={(e) =>
                                    handleOpenDeleteConfirm(project.id, e)
                                  }
                                  className="text-destructive focus:text-destructive"
                                >
                                  <Trash2
                                    className="mr-2 h-4 w-4"
                                    color="red"
                                  />
                                  Delete Project
                                </DropdownMenuItem>
                              )}

                              {/* Conditional: Show Continue Integration if status is pending */}
                              {project.status === "pending" && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={(e) =>
                                      handleContinueIntegration(project.id, e)
                                    }
                                  >
                                    <ArrowRight className="mr-2 h-4 w-4" />
                                    Continue Integration
                                  </DropdownMenuItem>
                                </>
                              )}

                              {/* Conditional: Show Set as Active if not currently active */}
                              {selectedProject !== project.name && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={(e) =>
                                      handleSetActiveProject(project.name, e)
                                    }
                                  >
                                    <CheckCheck className="mr-2 h-4 w-4" />
                                    Set as Active Project
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              <div className="flex items-center justify-center sm:justify-between mt-4 ">
                <p className="text-sm text-muted-foreground hidden sm:inline">
                  Showing {startIndex + 1}-
                  {Math.min(endIndex, filteredProjects.length)} of{" "}
                  {filteredProjects.length} Projects
                </p>
                <div className="flex items-center gap-1 sm:gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    <span className="text-xs"> Previous</span>
                  </Button>
                  {renderPagination()}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                  >
                    <span className="text-xs">Next</span>
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Integration/Dashboard Modal */}
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
            {modalProjectData && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl">
                    {modalProjectData.name}
                  </DialogTitle>
                  <DialogDescription>
                    {modalProjectData.description}
                  </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                  {(modalProjectData.status === "pending" ||
                    modalProjectData.status === "failed") && (
                    <div className="space-y-6">
                      {/* Stepper */}
                      <div className="flex items-center justify-between max-w-3xl mx-auto">
                        {steps.map((step, index) => (
                          <div
                            key={step.number}
                            className="flex items-center flex-1"
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 font-semibold transition-colors ${
                                  step.number === currentStep
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : step.number < currentStep
                                    ? "border-primary bg-primary/10 text-primary"
                                    : "border-muted-foreground/30 bg-muted/30 text-muted-foreground"
                                }`}
                              >
                                {step.number}
                              </div>
                              <div>
                                <p
                                  className={`text-xs font-normal ${
                                    step.number === currentStep
                                      ? "text-foreground"
                                      : "text-muted-foreground"
                                  }`}
                                >
                                  {step.title}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Integration Content */}
                      <Card>
                        <CardHeader>
                          <CardTitle>PostHog Integration</CardTitle>
                          <CardDescription>
                            Connect your PostHog account to start tracking
                            sessions
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Tabs
                            value={integrationTab}
                            onValueChange={setIntegrationTab}
                          >
                            <TabsList className="grid w-full max-w-md grid-cols-2">
                              <TabsTrigger value="existing">
                                Connect Existing Account
                              </TabsTrigger>
                              <TabsTrigger value="new">
                                Create New with Autoplay
                              </TabsTrigger>
                            </TabsList>
                            <TabsContent
                              value="existing"
                              className="space-y-4 mt-4"
                            >
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label htmlFor="api-key">API Key</Label>
                                  <Input
                                    id="api-key"
                                    placeholder="Enter your PostHog API key"
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="project-id">Project ID</Label>
                                  <Input
                                    id="project-id"
                                    placeholder="Enter your PostHog project ID"
                                    value={projectId}
                                    onChange={(e) =>
                                      setProjectId(e.target.value)
                                    }
                                  />
                                </div>

                                {connectionStatus === "success" && (
                                  <Alert className="border-green-500/50 bg-green-500/10">
                                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                                    <AlertDescription className="text-green-600">
                                      Successfully connected! Your integration
                                      is ready.
                                    </AlertDescription>
                                  </Alert>
                                )}

                                <Button
                                  onClick={handleConnect}
                                  disabled={
                                    isConnecting || !apiKey || !projectId
                                  }
                                  className="w-full"
                                >
                                  {isConnecting && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  )}
                                  {connectionStatus === "error"
                                    ? "Try Again"
                                    : isConnecting
                                    ? "Connecting..."
                                    : "Connect"}
                                </Button>
                              </div>
                            </TabsContent>
                            <TabsContent value="new" className="space-y-4 mt-4">
                              <div className="rounded-lg border bg-muted/50 p-4">
                                <div className="flex items-start gap-3">
                                  <Info className="h-5 w-5 text-muted-foreground mt-0.5" />
                                  <div className="space-y-1">
                                    <p className="text-sm font-medium">
                                      Automatic Setup
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      We'll create a new PostHog account and
                                      configure all the necessary settings
                                      automatically. You'll receive your
                                      credentials via email.
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label htmlFor="account-name">
                                    Account Name
                                  </Label>
                                  <Input
                                    id="account-name"
                                    placeholder="Enter account name"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="project-name">
                                    Project Name
                                  </Label>
                                  <Input
                                    id="project-name"
                                    placeholder="Enter project name"
                                    maxLength={50}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="email">Email</Label>
                                  <Input
                                    id="email"
                                    type="email"
                                    placeholder="your@email.com"
                                  />
                                </div>

                                <Collapsible
                                  open={showAdvanced}
                                  onOpenChange={setShowAdvanced}
                                >
                                  <CollapsibleTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      className="w-full justify-between px-0 hover:bg-transparent"
                                    >
                                      <span className="font-medium">
                                        Show Advanced Settings
                                      </span>
                                      <ChevronDown
                                        className={`h-4 w-4 transition-transform ${
                                          showAdvanced ? "rotate-180" : ""
                                        }`}
                                      />
                                    </Button>
                                  </CollapsibleTrigger>
                                  <CollapsibleContent className="space-y-4 mt-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="region">Region</Label>
                                      <Input
                                        id="region"
                                        placeholder="US (default)"
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="data-retention">
                                        Data Retention (days)
                                      </Label>
                                      <Input
                                        id="data-retention"
                                        type="number"
                                        placeholder="90"
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="timezone">Timezone</Label>
                                      <Input id="timezone" placeholder="UTC" />
                                    </div>
                                  </CollapsibleContent>
                                </Collapsible>
                              </div>

                              <div className="space-y-3">
                                <Collapsible
                                  open={codeSnippetsExpanded["install"]}
                                  onOpenChange={() =>
                                    toggleCodeSnippet("install")
                                  }
                                >
                                  <CollapsibleTrigger asChild>
                                    <Button
                                      variant="outline"
                                      className="w-full justify-between bg-transparent"
                                    >
                                      <span className="font-medium">
                                        Installation Code
                                      </span>
                                      <ChevronDown
                                        className={`h-4 w-4 transition-transform ${
                                          codeSnippetsExpanded["install"]
                                            ? "rotate-180"
                                            : ""
                                        }`}
                                      />
                                    </Button>
                                  </CollapsibleTrigger>
                                  <CollapsibleContent className="mt-2">
                                    <div className="rounded-lg border bg-muted/50 p-3">
                                      <div className="flex items-center justify-between mb-2">
                                        <code className="text-sm font-mono">
                                          npm install posthog-js
                                        </code>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() =>
                                            copyToClipboard(
                                              "npm install posthog-js",
                                              "install"
                                            )
                                          }
                                        >
                                          {copied === "install" ? (
                                            <Check className="h-4 w-4" />
                                          ) : (
                                            <Copy className="h-4 w-4" />
                                          )}
                                        </Button>
                                      </div>
                                    </div>
                                  </CollapsibleContent>
                                </Collapsible>

                                <Collapsible
                                  open={codeSnippetsExpanded["init"]}
                                  onOpenChange={() => toggleCodeSnippet("init")}
                                >
                                  <CollapsibleTrigger asChild>
                                    <Button
                                      variant="outline"
                                      className="w-full justify-between bg-transparent"
                                    >
                                      <span className="font-medium">
                                        Initialization Code
                                      </span>
                                      <ChevronDown
                                        className={`h-4 w-4 transition-transform ${
                                          codeSnippetsExpanded["init"]
                                            ? "rotate-180"
                                            : ""
                                        }`}
                                      />
                                    </Button>
                                  </CollapsibleTrigger>
                                  <CollapsibleContent className="mt-2">
                                    <div className="rounded-lg border bg-muted/50 p-3">
                                      <div className="flex items-center justify-between">
                                        <pre className="text-sm font-mono overflow-x-auto">
                                          {`posthog.init('YOUR_API_KEY', {
  api_host: 'https://app.posthog.com'
})`}
                                        </pre>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() =>
                                            copyToClipboard(
                                              "posthog.init('YOUR_API_KEY', { api_host: 'https://app.posthog.com' })",
                                              "init"
                                            )
                                          }
                                        >
                                          {copied === "init" ? (
                                            <Check className="h-4 w-4" />
                                          ) : (
                                            <Copy className="h-4 w-4" />
                                          )}
                                        </Button>
                                      </div>
                                    </div>
                                  </CollapsibleContent>
                                </Collapsible>
                              </div>

                              <Button className="w-full">
                                Create New Account
                              </Button>
                            </TabsContent>
                          </Tabs>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {modalProjectData.status === "completed" && (
                    <>
                      <div className="flex items-center justify-between max-w-3xl mx-auto mb-10">
                        {steps.map((step, index) => (
                          <div
                            key={step.number}
                            className="flex items-center flex-1"
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 font-semibold transition-colors ${
                                  step.number === currentStep
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : step.number < currentStep
                                    ? "border-primary bg-primary/10 text-primary"
                                    : "border-muted-foreground/30 bg-muted/30 text-muted-foreground"
                                }`}
                              >
                                {step.number}
                              </div>
                              <div>
                                <p
                                  className={`text-xs font-normal ${
                                    step.number === currentStep
                                      ? "text-foreground"
                                      : "text-muted-foreground"
                                  }`}
                                >
                                  {step.title}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="min-h-screen flex  justify-center bg-background px-4">
                        <div className="text-center max-w-md">
                          {/* Success Icon */}
                          <div className="mb-8 flex justify-center">
                            <div className="rounded-full bg-emerald-50 p-8">
                              <CheckCircle2 className="w-20 h-20 text-emerald-600 stroke-[2.5]" />
                            </div>
                          </div>
                          <h1 className="text-5xl font-bold text-foreground mb-6">
                            Success
                          </h1>

                          <p className="text-lg text-muted-foreground leading-relaxed">
                            Posthog integration is completed and actively
                            monitoring user sessions.
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={addProjectOpen} onOpenChange={setAddProjectOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Project</DialogTitle>
              <DialogDescription>
                Create a new AutoPlay project
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="new-project-name">Project Name</Label>
                <Input
                  id="new-project-name"
                  placeholder="Enter project name"
                  maxLength={50}
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-project-description">Description</Label>
                <Textarea
                  id="new-project-description"
                  placeholder="Enter project description"
                  value={newProjectDescription}
                  onChange={(e) => setNewProjectDescription(e.target.value)}
                  rows={3}
                />

                <p className="text-xs text-muted-foreground text-right">
                  {newProjectDescription.length}/{maxDescriptionLength}{" "}
                  characters
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setAddProjectOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddProject}>Create Project</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Settings Dialog */}
        <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Project Settings</DialogTitle>
              <DialogDescription>
                Update your project details and configuration
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="project-name">
                  Project Name<sup className="text-red-600">*</sup>
                </Label>
                <Input
                  id="project-name"
                  maxLength={50}
                  value={editProjectName}
                  onChange={(e) => setEditProjectName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="project-description">
                  Description<sup className="text-red-600">*</sup>
                </Label>
                <Textarea
                  id="project-description"
                  value={editProjectDescription}
                  onChange={(e) =>
                    setEditProjectDescription(
                      e.target.value.slice(0, maxDescriptionLength)
                    )
                  }
                  rows={3}
                />
                <p className="text-xs text-muted-foreground text-right">
                  {editProjectDescription.length}/{maxDescriptionLength}{" "}
                  characters
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSettingsOpen(false)}>
                Cancel
              </Button>

              <Button
                onClick={handleSaveProjectSettings}
                disabled={
                  !editProjectName.trim() || !editProjectDescription.trim()
                }
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Project</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete{" "}
                <strong>{deleteProjectData?.name}</strong>? This action cannot
                be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleteConfirmOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteProject}>
                Delete Project
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Toaster />
      </div>
    </TooltipProvider>
  );
}
