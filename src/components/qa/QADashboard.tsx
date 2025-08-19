
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, XCircle, AlertTriangle, Play, Download } from "lucide-react";
import { qaService, type FeatureTestResult } from "@/lib/testing/endToEndTests";
import { toast } from "sonner";

export function QADashboard() {
  const [testResults, setTestResults] = useState<FeatureTestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [hasRun, setHasRun] = useState(false);

  const runQATests = async () => {
    setIsRunning(true);
    try {
      toast.info("Starting comprehensive QA test suite...");
      const results = await qaService.runFullQATest();
      setTestResults(results);
      setHasRun(true);
      toast.success("QA test suite completed!");
    } catch (error) {
      toast.error("Failed to run QA tests");
      console.error("QA Test Error:", error);
    } finally {
      setIsRunning(false);
    }
  };

  const downloadReport = () => {
    const report = qaService.generateReport();
    const blob = new Blob([report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `minutehire-qa-report-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("QA report downloaded successfully");
  };

  const getOverallStats = () => {
    const totalTests = testResults.reduce((sum, feature) => sum + feature.tests.length, 0);
    const passedTests = testResults.reduce((sum, feature) => 
      sum + feature.tests.filter(t => t.status === 'pass').length, 0);
    const failedTests = testResults.reduce((sum, feature) => 
      sum + feature.tests.filter(t => t.status === 'fail').length, 0);
    const warningTests = testResults.reduce((sum, feature) => 
      sum + feature.tests.filter(t => t.status === 'warning').length, 0);

    return { totalTests, passedTests, failedTests, warningTests };
  };

  const stats = hasRun ? getOverallStats() : { totalTests: 0, passedTests: 0, failedTests: 0, warningTests: 0 };
  const overallProgress = stats.totalTests > 0 ? (stats.passedTests / stats.totalTests) * 100 : 0;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">MinuteHire QA Dashboard</h1>
          <p className="text-muted-foreground">Comprehensive testing and quality assurance</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={runQATests} 
            disabled={isRunning}
            size="lg"
          >
            <Play className="h-4 w-4 mr-2" />
            {isRunning ? "Running Tests..." : "Run QA Tests"}
          </Button>
          {hasRun && (
            <Button variant="outline" onClick={downloadReport}>
              <Download className="h-4 w-4 mr-2" />
              Download Report
            </Button>
          )}
        </div>
      </div>

      {hasRun && (
        <>
          {/* Overall Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalTests}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-green-600">Passed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.passedTests}</div>
                <p className="text-sm text-muted-foreground">
                  {stats.totalTests > 0 ? Math.round((stats.passedTests / stats.totalTests) * 100) : 0}%
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-red-600">Failed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{stats.failedTests}</div>
                <p className="text-sm text-muted-foreground">
                  {stats.totalTests > 0 ? Math.round((stats.failedTests / stats.totalTests) * 100) : 0}%
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-yellow-600">Warnings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{stats.warningTests}</div>
                <p className="text-sm text-muted-foreground">
                  {stats.totalTests > 0 ? Math.round((stats.warningTests / stats.totalTests) * 100) : 0}%
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Overall Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Overall Test Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Success Rate</span>
                  <span>{Math.round(overallProgress)}%</span>
                </div>
                <Progress value={overallProgress} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{stats.passedTests} passed</span>
                  <span>{stats.failedTests} failed</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Feature Test Results */}
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="details">Detailed Results</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {testResults.map((feature, index) => {
                  const passedCount = feature.tests.filter(t => t.status === 'pass').length;
                  const totalCount = feature.tests.length;
                  const successRate = totalCount > 0 ? (passedCount / totalCount) * 100 : 0;
                  
                  return (
                    <Card key={index}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm">{feature.feature}</CardTitle>
                          {feature.overallStatus === 'pass' ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-600" />
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Success Rate</span>
                            <span>{Math.round(successRate)}%</span>
                          </div>
                          <Progress value={successRate} className="h-1" />
                          <div className="text-xs text-muted-foreground">
                            {passedCount}/{totalCount} tests passed
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="details">
              <div className="space-y-6">
                {testResults.map((feature, featureIndex) => (
                  <Card key={featureIndex}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>{feature.feature}</CardTitle>
                        <Badge 
                          variant={feature.overallStatus === 'pass' ? 'default' : 'destructive'}
                        >
                          {feature.overallStatus === 'pass' ? 'PASS' : 'FAIL'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {feature.tests.map((test, testIndex) => (
                          <div key={testIndex} className="flex items-start gap-3 p-3 border rounded-lg">
                            {test.status === 'pass' && <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />}
                            {test.status === 'fail' && <XCircle className="h-5 w-5 text-red-600 mt-0.5" />}
                            {test.status === 'warning' && <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />}
                            
                            <div className="flex-1">
                              <h4 className="font-medium">{test.testName}</h4>
                              <p className="text-sm text-muted-foreground">{test.message}</p>
                              {test.details && (
                                <pre className="text-xs bg-muted p-2 rounded mt-2 overflow-x-auto">
                                  {JSON.stringify(test.details, null, 2)}
                                </pre>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}

      {!hasRun && !isRunning && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="space-y-4">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Play className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Ready to Run QA Tests</h3>
                <p className="text-muted-foreground mb-4">
                  Click "Run QA Tests" to start comprehensive testing of all MinuteHire features
                </p>
                <Button onClick={runQATests} size="lg">
                  <Play className="h-4 w-4 mr-2" />
                  Start QA Testing
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {isRunning && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="space-y-4">
              <div className="animate-spin mx-auto w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full"></div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Running QA Tests...</h3>
                <p className="text-muted-foreground">
                  Testing all features and functionality. This may take a few moments.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
