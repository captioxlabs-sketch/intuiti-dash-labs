import { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend, ReferenceLine
} from 'recharts';
import { ChartTooltip } from '@/components/ChartTooltip';
import { 
  Calendar, TrendingUp, TrendingDown, Clock, CheckCircle2, AlertTriangle,
  FileText, Shield, Activity, Target, ChevronRight, Filter
} from 'lucide-react';

// Historical compliance data (monthly for past 12 months)
const historicalData = [
  { month: 'Jan 2024', iec62443: 62, nistCsf: 58, cisControls: 55, overall: 58 },
  { month: 'Feb 2024', iec62443: 64, nistCsf: 60, cisControls: 57, overall: 60 },
  { month: 'Mar 2024', iec62443: 65, nistCsf: 62, cisControls: 60, overall: 62 },
  { month: 'Apr 2024', iec62443: 68, nistCsf: 65, cisControls: 62, overall: 65 },
  { month: 'May 2024', iec62443: 70, nistCsf: 67, cisControls: 64, overall: 67 },
  { month: 'Jun 2024', iec62443: 72, nistCsf: 70, cisControls: 66, overall: 69 },
  { month: 'Jul 2024', iec62443: 73, nistCsf: 71, cisControls: 68, overall: 71 },
  { month: 'Aug 2024', iec62443: 75, nistCsf: 73, cisControls: 70, overall: 73 },
  { month: 'Sep 2024', iec62443: 76, nistCsf: 74, cisControls: 72, overall: 74 },
  { month: 'Oct 2024', iec62443: 78, nistCsf: 76, cisControls: 74, overall: 76 },
  { month: 'Nov 2024', iec62443: 80, nistCsf: 78, cisControls: 76, overall: 78 },
  { month: 'Dec 2024', iec62443: 82, nistCsf: 80, cisControls: 78, overall: 80 },
];

// Audit events timeline
const auditEvents = [
  {
    id: 1,
    date: '2024-12-15',
    type: 'audit',
    title: 'Q4 Internal Security Audit',
    framework: 'All',
    status: 'completed',
    findings: 3,
    description: 'Quarterly internal audit covering all compliance frameworks',
    impact: '+2.5%'
  },
  {
    id: 2,
    date: '2024-11-28',
    type: 'remediation',
    title: 'Critical Vulnerability Remediation',
    framework: 'CIS Controls',
    status: 'completed',
    findings: 0,
    description: 'Addressed critical findings from vulnerability assessment',
    impact: '+1.8%'
  },
  {
    id: 3,
    date: '2024-11-10',
    type: 'certification',
    title: 'IEC 62443 SL-2 Certification Renewed',
    framework: 'IEC 62443',
    status: 'completed',
    findings: 0,
    description: 'Successfully renewed Security Level 2 certification',
    impact: '+3.2%'
  },
  {
    id: 4,
    date: '2024-10-22',
    type: 'assessment',
    title: 'NIST CSF Gap Assessment',
    framework: 'NIST CSF',
    status: 'completed',
    findings: 5,
    description: 'Third-party assessment of NIST Cybersecurity Framework alignment',
    impact: '-0.5%'
  },
  {
    id: 5,
    date: '2024-09-15',
    type: 'audit',
    title: 'Q3 Internal Security Audit',
    framework: 'All',
    status: 'completed',
    findings: 7,
    description: 'Quarterly internal audit with focus on network segmentation',
    impact: '+1.5%'
  },
  {
    id: 6,
    date: '2024-08-20',
    type: 'policy',
    title: 'Security Policy Update',
    framework: 'All',
    status: 'completed',
    findings: 0,
    description: 'Updated incident response and access control policies',
    impact: '+2.0%'
  },
  {
    id: 7,
    date: '2024-07-12',
    type: 'training',
    title: 'Security Awareness Training',
    framework: 'CIS Controls',
    status: 'completed',
    findings: 0,
    description: 'Completed annual security awareness training for all staff',
    impact: '+1.2%'
  },
  {
    id: 8,
    date: '2024-06-18',
    type: 'audit',
    title: 'Q2 Internal Security Audit',
    framework: 'All',
    status: 'completed',
    findings: 12,
    description: 'Quarterly internal audit covering infrastructure security',
    impact: '+2.8%'
  },
];

// Milestones and targets
const milestones = [
  { date: '2024-03-01', label: 'Baseline Assessment', score: 62 },
  { date: '2024-06-15', label: 'IEC 62443 SL-2 Target', score: 70 },
  { date: '2024-09-30', label: 'Q3 Target', score: 75 },
  { date: '2024-12-31', label: 'Year-End Target', score: 80 },
  { date: '2025-06-30', label: 'H1 2025 Target', score: 85 },
  { date: '2025-12-31', label: 'Year-End 2025 Goal', score: 90 },
];

// Framework-specific trends
const frameworkTrends = [
  {
    framework: 'IEC 62443',
    currentScore: 82,
    previousScore: 62,
    change: '+20',
    trend: 'up',
    color: 'hsl(var(--chart-1))',
    highlights: ['SL-2 Certification', 'Zone Segmentation Complete', 'Asset Inventory 95%']
  },
  {
    framework: 'NIST CSF',
    currentScore: 80,
    previousScore: 58,
    change: '+22',
    trend: 'up',
    color: 'hsl(var(--chart-2))',
    highlights: ['Detect Function Improved', 'Response Plans Updated', 'Recovery Tested']
  },
  {
    framework: 'CIS Controls',
    currentScore: 78,
    previousScore: 55,
    change: '+23',
    trend: 'up',
    color: 'hsl(var(--chart-3))',
    highlights: ['IG1 Complete', 'IG2 at 85%', 'IG3 Started']
  },
];

const getEventIcon = (type: string) => {
  switch (type) {
    case 'audit': return <FileText className="h-4 w-4" />;
    case 'certification': return <Shield className="h-4 w-4" />;
    case 'assessment': return <Target className="h-4 w-4" />;
    case 'remediation': return <CheckCircle2 className="h-4 w-4" />;
    case 'policy': return <FileText className="h-4 w-4" />;
    case 'training': return <Activity className="h-4 w-4" />;
    default: return <Calendar className="h-4 w-4" />;
  }
};

const getEventColor = (type: string) => {
  switch (type) {
    case 'audit': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'certification': return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'assessment': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'remediation': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    case 'policy': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
    case 'training': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    default: return 'bg-muted text-muted-foreground';
  }
};

const ComplianceTimeline = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('12m');
  const [selectedFramework, setSelectedFramework] = useState('all');

  const filteredEvents = selectedFramework === 'all' 
    ? auditEvents 
    : auditEvents.filter(e => e.framework === selectedFramework || e.framework === 'All');

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">Compliance Timeline</h1>
            <p className="text-muted-foreground mt-1">Historical compliance scores and audit history across all frameworks</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-32 bg-card border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3m">3 Months</SelectItem>
                <SelectItem value="6m">6 Months</SelectItem>
                <SelectItem value="12m">12 Months</SelectItem>
                <SelectItem value="24m">24 Months</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
        </div>

        {/* Overall Progress Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-card/50 border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Overall Score</p>
                  <p className="text-3xl font-bold text-foreground">80%</p>
                </div>
                <div className="flex items-center gap-1 text-green-400">
                  <TrendingUp className="h-5 w-5" />
                  <span className="text-sm font-medium">+22%</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Since Jan 2024</p>
            </CardContent>
          </Card>
          
          {frameworkTrends.map((fw, index) => (
            <Card key={index} className="bg-card/50 border-border/50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{fw.framework}</p>
                    <p className="text-3xl font-bold text-foreground">{fw.currentScore}%</p>
                  </div>
                  <div className={`flex items-center gap-1 ${fw.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                    {fw.trend === 'up' ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                    <span className="text-sm font-medium">{fw.change}</span>
                  </div>
                </div>
                <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${fw.currentScore}%`, backgroundColor: fw.color }}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="trends" className="space-y-4">
          <TabsList className="bg-muted/50 border border-border">
            <TabsTrigger value="trends">Score Trends</TabsTrigger>
            <TabsTrigger value="events">Audit Events</TabsTrigger>
            <TabsTrigger value="milestones">Milestones</TabsTrigger>
          </TabsList>

          <TabsContent value="trends" className="space-y-4">
            {/* Main Trend Chart */}
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="text-foreground">Compliance Score Trends</CardTitle>
                <CardDescription>Historical compliance scores across all frameworks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={historicalData}>
                      <defs>
                        <linearGradient id="gradientIec" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="gradientNist" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="gradientCis" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                      <XAxis 
                        dataKey="month" 
                        stroke="hsl(var(--muted-foreground))" 
                        fontSize={12}
                        tickLine={false}
                      />
                      <YAxis 
                        stroke="hsl(var(--muted-foreground))" 
                        fontSize={12}
                        tickLine={false}
                        domain={[50, 100]}
                        tickFormatter={(value) => `${value}%`}
                      />
                      <Tooltip content={<ChartTooltip valueFormatter={(v) => `${v}%`} />} />
                      <Legend />
                      <ReferenceLine y={80} stroke="hsl(var(--chart-4))" strokeDasharray="5 5" label={{ value: 'Target', fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} />
                      <Area 
                        type="monotone" 
                        dataKey="iec62443" 
                        name="IEC 62443"
                        stroke="hsl(var(--chart-1))" 
                        fill="url(#gradientIec)"
                        strokeWidth={2}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="nistCsf" 
                        name="NIST CSF"
                        stroke="hsl(var(--chart-2))" 
                        fill="url(#gradientNist)"
                        strokeWidth={2}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="cisControls" 
                        name="CIS Controls"
                        stroke="hsl(var(--chart-3))" 
                        fill="url(#gradientCis)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Framework Highlights */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {frameworkTrends.map((fw, index) => (
                <Card key={index} className="bg-card/50 border-border/50">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-foreground">{fw.framework}</CardTitle>
                      <Badge 
                        variant="outline" 
                        className="bg-green-500/10 text-green-400 border-green-500/30"
                      >
                        {fw.change} YTD
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Starting Score</span>
                        <span className="text-foreground font-medium">{fw.previousScore}%</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Current Score</span>
                        <span className="text-foreground font-medium">{fw.currentScore}%</span>
                      </div>
                      <div className="border-t border-border/50 pt-3 mt-3">
                        <p className="text-xs text-muted-foreground mb-2">Key Achievements</p>
                        <div className="space-y-1">
                          {fw.highlights.map((highlight, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm">
                              <CheckCircle2 className="h-3 w-3 text-green-400" />
                              <span className="text-foreground">{highlight}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="events" className="space-y-4">
            {/* Events Filter */}
            <Card className="bg-card/50 border-border/50">
              <CardContent className="pt-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">Filter by Framework:</span>
                  <div className="flex gap-2">
                    {['all', 'IEC 62443', 'NIST CSF', 'CIS Controls'].map((fw) => (
                      <Button
                        key={fw}
                        variant={selectedFramework === fw ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedFramework(fw)}
                        className={selectedFramework === fw ? '' : 'bg-transparent'}
                      >
                        {fw === 'all' ? 'All Frameworks' : fw}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Events Timeline */}
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="text-foreground">Audit & Compliance Events</CardTitle>
                <CardDescription>Timeline of audits, assessments, and compliance activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />
                  
                  <div className="space-y-6">
                    {filteredEvents.map((event, index) => (
                      <div key={event.id} className="relative flex gap-4 animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                        {/* Timeline dot */}
                        <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border ${getEventColor(event.type)}`}>
                          {getEventIcon(event.type)}
                        </div>
                        
                        {/* Event content */}
                        <div className="flex-1 bg-muted/30 rounded-lg p-4 border border-border/50 hover:border-border transition-colors">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium text-foreground">{event.title}</h4>
                                <Badge variant="outline" className="text-xs">
                                  {event.framework}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(event.date).toLocaleDateString('en-US', { 
                                    year: 'numeric', 
                                    month: 'short', 
                                    day: 'numeric' 
                                  })}
                                </span>
                                {event.findings > 0 && (
                                  <span className="flex items-center gap-1">
                                    <AlertTriangle className="h-3 w-3 text-yellow-400" />
                                    {event.findings} findings
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge 
                                variant="outline" 
                                className={event.impact.startsWith('+') 
                                  ? 'bg-green-500/10 text-green-400 border-green-500/30' 
                                  : 'bg-red-500/10 text-red-400 border-red-500/30'
                                }
                              >
                                {event.impact}
                              </Badge>
                              <p className="text-xs text-muted-foreground mt-1">Score Impact</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="milestones" className="space-y-4">
            {/* Milestones Chart */}
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="text-foreground">Compliance Roadmap</CardTitle>
                <CardDescription>Target milestones and progress tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={milestones.map(m => ({ ...m, name: m.label }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                      <XAxis 
                        dataKey="label" 
                        stroke="hsl(var(--muted-foreground))" 
                        fontSize={10}
                        tickLine={false}
                        angle={-15}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis 
                        stroke="hsl(var(--muted-foreground))" 
                        fontSize={12}
                        tickLine={false}
                        domain={[50, 100]}
                        tickFormatter={(value) => `${value}%`}
                      />
                      <Tooltip content={<ChartTooltip valueFormatter={(v) => `${v}%`} />} />
                      <ReferenceLine y={80} stroke="hsl(var(--chart-4))" strokeDasharray="5 5" />
                      <Line 
                        type="monotone" 
                        dataKey="score" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={3}
                        dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 6 }}
                        activeDot={{ r: 8, fill: 'hsl(var(--primary))' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Milestone Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {milestones.map((milestone, index) => {
                const isPast = new Date(milestone.date) <= new Date();
                const isNext = !isPast && index === milestones.findIndex(m => new Date(m.date) > new Date());
                
                return (
                  <Card 
                    key={index} 
                    className={`bg-card/50 border-border/50 transition-all ${
                      isNext ? 'ring-2 ring-primary/50' : ''
                    }`}
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-2 rounded-lg ${
                          isPast 
                            ? 'bg-green-500/20 text-green-400' 
                            : isNext 
                              ? 'bg-primary/20 text-primary' 
                              : 'bg-muted text-muted-foreground'
                        }`}>
                          {isPast ? <CheckCircle2 className="h-5 w-5" /> : <Target className="h-5 w-5" />}
                        </div>
                        {isNext && (
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                            Next Target
                          </Badge>
                        )}
                        {isPast && (
                          <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30">
                            Achieved
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-semibold text-foreground mb-1">{milestone.label}</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {new Date(milestone.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-foreground">{milestone.score}%</span>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Progress to Next Milestone */}
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="text-foreground">Progress to Next Milestone</CardTitle>
                <CardDescription>Year-End 2025 Goal: 90% Overall Compliance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Current Score</span>
                    <span className="font-medium text-foreground">80%</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-chart-2 rounded-full transition-all duration-500"
                      style={{ width: '80%' }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Remaining</span>
                    <span className="font-medium text-foreground">10% to reach 90% target</span>
                  </div>
                  <div className="pt-4 border-t border-border/50">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>Estimated completion: Q4 2025 at current improvement rate</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ComplianceTimeline;
