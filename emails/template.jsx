import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";



export default function EmailTemplate({
  userName = "",
  type = "budget-alert",
  data = {},
}) {
  if (type === "monthly-report") {
    return (
      <Html>
        <Head />
        <Preview>Your Monthly Financial Report</Preview>
        <Body style={styles.body}>
          <Container style={styles.container}>
            <Heading style={styles.title}>Monthly Financial Report</Heading>

            <Text style={styles.text}>Hello {userName},</Text>
            <Text style={styles.text}>
              Here&rsquo;s your financial summary for {data?.month || "this month"}:
            </Text>            
            {/* Main Stats */}
            <Section style={styles.statsContainer}>
              <div style={styles.stat}>
                <Text style={styles.label}>Total Income</Text>
                <Text style={styles.amount}>₹{(data?.stats?.totalIncome || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
              </div>
              <div style={styles.stat}>
                <Text style={styles.label}>Total Expenses</Text>
                <Text style={styles.amount}>₹{(data?.stats?.totalExpenses || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
              </div>
              <div style={styles.stat}>
                <Text style={styles.label}>Net Savings</Text>
                <Text style={{
                  ...styles.amount,
                  color: ((data?.stats?.totalIncome || 0) - (data?.stats?.totalExpenses || 0)) >= 0 ? '#10b981' : '#ef4444'
                }}>
                  ₹{((data?.stats?.totalIncome || 0) - (data?.stats?.totalExpenses || 0)).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Text>
              </div>
              <div style={styles.stat}>
                <Text style={styles.label}>Savings Rate</Text>
                <Text style={styles.amount}>
                  {data?.stats?.totalIncome > 0 
                    ? (((data.stats.totalIncome - data.stats.totalExpenses) / data.stats.totalIncome) * 100).toFixed(1) 
                    : '0.0'}%
                </Text>
              </div>
            </Section>            
            {/* Category Breakdown */}
            {data?.stats?.byCategory && Object.keys(data.stats.byCategory).length > 0 && (
              <Section style={styles.section}>
                <Heading style={styles.heading}>💰 Expenses by Category</Heading>
                <div style={styles.categoryContainer}>
                  {Object.entries(data.stats.byCategory)
                    .sort(([,a], [,b]) => b - a) // Sort by amount descending
                    .map(([category, amount]) => {
                      const percentage = data.stats.totalExpenses > 0 
                        ? ((amount / data.stats.totalExpenses) * 100).toFixed(1)
                        : '0.0';
                      return (
                        <div key={category} style={styles.categoryRow}>
                          <div style={styles.categoryInfo}>
                            <Text style={styles.categoryName}>{category}</Text>
                            <Text style={styles.categoryPercentage}>{percentage}% of total</Text>
                          </div>
                          <Text style={styles.categoryAmount}>₹{Number(amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
                        </div>
                      );
                    })}
                </div>
              </Section>
            )}            
            {/* AI Insights */}
            {data?.insights && data.insights.length > 0 && (
              <Section style={styles.section}>
                <Heading style={styles.heading}>🧠 Fortified AI Insights</Heading>
                <div style={styles.insightsContainer}>
                  {data.insights.map((insight, index) => (
                    <div key={index} style={styles.insightItem}>
                      <div style={styles.insightNumber}>{index + 1}</div>
                      <Text style={styles.insightText}>{insight}</Text>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Monthly Summary */}
            <Section style={styles.section}>
              <Heading style={styles.heading}>📊 Quick Summary</Heading>
              <div style={styles.summaryGrid}>
                <div style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Transactions</Text>
                  <Text style={styles.summaryValue}>{data?.stats?.transactionCount || 0}</Text>
                </div>
                <div style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Avg. Daily Expense</Text>
                  <Text style={styles.summaryValue}>₹{Math.round((data?.stats?.totalExpenses || 0) / 30).toLocaleString('en-IN')}</Text>
                </div>
                <div style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Top Category</Text>
                  <Text style={styles.summaryValue}>
                    {data?.stats?.byCategory && Object.keys(data.stats.byCategory).length > 0
                      ? Object.entries(data.stats.byCategory).sort(([,a], [,b]) => b - a)[0][0]
                      : 'None'}
                  </Text>
                </div>
              </div>
            </Section>            <Text style={styles.footer}>
              💡 <strong>Tip:</strong> Regular financial tracking helps build better money habits and achieve your financial goals faster.
              <br /><br />
              Thank you for using Fortified - Your trusted financial companion! 🚀
              <br />
              <span style={{ fontSize: '12px', color: '#9ca3af' }}>
                This is an automated monthly report. Keep tracking for better financial health!
              </span>
            </Text>
          </Container>
        </Body>
      </Html>
    );
  }
  if (type === "budget-alert") {
    const percentageUsed = data?.percentageUsed || 0;
    const budgetAmount = parseFloat(data?.budgetAmount) || 0;
    const totalExpenses = parseFloat(data?.totalExpenses) || 0;
    const remainingAmount = parseFloat(data?.remainingAmount) || (budgetAmount - totalExpenses);
    
    return (
      <Html>
        <Head />
        <Preview>🚨 Budget Alert - {percentageUsed}% Used</Preview>
        <Body style={styles.body}>
          <Container style={styles.container}>
            <div style={styles.alertHeader}>
              <Heading style={{...styles.title, color: percentageUsed >= 90 ? '#dc2626' : '#f59e0b'}}>
                {percentageUsed >= 90 ? '🚨' : '⚠️'} Budget Alert
              </Heading>
            </div>
            
            <Text style={styles.text}>Hello {userName},</Text>
            <Text style={styles.text}>
              You&rsquo;ve used <strong>{percentageUsed}%</strong> of your monthly budget for <strong>{data?.accountName}</strong>.
              {percentageUsed >= 90 
                ? " You're approaching your budget limit!" 
                : percentageUsed >= 80 
                ? " You're getting close to your budget limit." 
                : " Keep monitoring your expenses."}
            </Text>

            {/* Progress Bar */}
            <div style={styles.progressContainer}>
              <div style={styles.progressLabel}>
                <Text style={styles.progressText}>Budget Usage: {percentageUsed}%</Text>
              </div>
              <div style={styles.progressBar}>
                <div style={{
                  ...styles.progressFill,
                  width: `${Math.min(percentageUsed, 100)}%`,
                  backgroundColor: percentageUsed >= 90 ? '#dc2626' : percentageUsed >= 80 ? '#f59e0b' : '#10b981'
                }}></div>
              </div>
            </div>

            <Section style={styles.statsContainer}>
              <div style={styles.stat}>
                <Text style={styles.label}>Budget Amount</Text>
                <Text style={styles.amount}>₹{budgetAmount.toLocaleString('en-IN')}</Text>
              </div>
              <div style={styles.stat}>
                <Text style={styles.label}>Spent So Far</Text>
                <Text style={styles.amount}>₹{totalExpenses.toLocaleString('en-IN')}</Text>
              </div>
              <div style={styles.stat}>
                <Text style={styles.label}>Remaining</Text>
                <Text style={{
                  ...styles.amount,
                  color: remainingAmount >= 0 ? '#10b981' : '#dc2626'
                }}>
                  ₹{Math.abs(remainingAmount).toLocaleString('en-IN')}
                  {remainingAmount < 0 ? ' (Over Budget)' : ''}
                </Text>
              </div>
            </Section>

            {/* Quick Tips */}
            <Section style={styles.section}>
              <Heading style={styles.heading}>💡 Quick Tips</Heading>
              {percentageUsed >= 90 ? (
                <div>
                  <Text style={styles.text}>• Review your recent expenses and cut non-essential spending</Text>
                  <Text style={styles.text}>• Consider postponing discretionary purchases until next month</Text>
                  <Text style={styles.text}>• Use cash for remaining expenses to avoid overspending</Text>
                </div>
              ) : (
                <div>
                  <Text style={styles.text}>• Track daily expenses to stay within budget</Text>
                  <Text style={styles.text}>• Consider setting aside the remaining amount for emergencies</Text>
                  <Text style={styles.text}>• Review your spending categories for optimization opportunities</Text>
                </div>
              )}
            </Section>

            <Text style={styles.footer}>
              Stay on track with your financial goals! 💪
              <br />
              <span style={{ fontSize: '12px', color: '#9ca3af' }}>
                This alert helps you maintain healthy spending habits.
              </span>
            </Text>
          </Container>
        </Body>
      </Html>
    );
  }
  // Default fallback if an unrecognized type is passed
  return (
    <Html>
      <Head />
      <Preview>Fortified Notification</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Heading style={styles.title}>🔔 Notification from Fortified</Heading>
          <Text style={styles.text}>Hello {userName || "User"},</Text>
          <Text style={styles.text}>
            Thank you for using Fortified for your financial management.
          </Text>
          <Text style={styles.text}>
            We're here to help you achieve your financial goals! 💰
          </Text>
          <Text style={styles.footer}>
            Best regards,<br />
            The Fortified Team
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const styles = {
  body: {
    backgroundColor: "#f6f9fc",
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
  },
  container: {
    backgroundColor: "#ffffff",
    margin: "0 auto",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    maxWidth: "600px",
  },
  title: {
    color: "#1f2937",
    fontSize: "28px",
    fontWeight: "bold",
    textAlign: "center",
    margin: "0 0 24px",
  },
  heading: {
    color: "#1f2937",
    fontSize: "20px",
    fontWeight: "600",
    margin: "24px 0 16px",
  },
  text: {
    color: "#4b5563",
    fontSize: "16px",
    lineHeight: "1.6",
    margin: "0 0 16px",
  },
  label: {
    color: "#6b7280",
    fontSize: "14px",
    fontWeight: "500",
    margin: "0 0 8px",
  },
  amount: {
    color: "#1f2937",
    fontSize: "24px",
    fontWeight: "bold",
    margin: "0",
  },
  section: {
    marginTop: "24px",
    padding: "20px",
    backgroundColor: "#f9fafb",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
  },
  statsContainer: {
    margin: "24px 0",
    padding: "20px",
    backgroundColor: "#f9fafb",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: "16px",
  },
  stat: {
    padding: "16px",
    backgroundColor: "#fff",
    borderRadius: "6px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
    textAlign: "center",
  },
  categoryContainer: {
    backgroundColor: "#fff",
    borderRadius: "6px",
    overflow: "hidden",
  },
  categoryRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 16px",
    borderBottom: "1px solid #f3f4f6",
  },
  categoryInfo: {
    flex: "1",
  },
  categoryName: {
    color: "#1f2937",
    fontSize: "16px",
    fontWeight: "500",
    margin: "0 0 4px",
  },
  categoryPercentage: {
    color: "#6b7280",
    fontSize: "12px",
    margin: "0",
  },
  categoryAmount: {
    color: "#1f2937",
    fontSize: "16px",
    fontWeight: "600",
    margin: "0",
  },
  insightsContainer: {
    backgroundColor: "#fff",
    borderRadius: "6px",
    padding: "16px",
  },
  insightItem: {
    display: "flex",
    alignItems: "flex-start",
    marginBottom: "16px",
    padding: "12px",
    backgroundColor: "#f8fafc",
    borderRadius: "6px",
    borderLeft: "4px solid #3b82f6",
  },
  insightNumber: {
    backgroundColor: "#3b82f6",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "bold",
    borderRadius: "50%",
    width: "24px",
    height: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: "12px",
    flexShrink: "0",
  },
  insightText: {
    color: "#1f2937",
    fontSize: "15px",
    lineHeight: "1.5",
    margin: "0",
    flex: "1",
  },
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
    gap: "16px",
  },
  summaryItem: {
    backgroundColor: "#fff",
    padding: "16px",
    borderRadius: "6px",
    textAlign: "center",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  },
  summaryLabel: {
    color: "#6b7280",
    fontSize: "12px",
    fontWeight: "500",
    margin: "0 0 8px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  summaryValue: {
    color: "#1f2937",
    fontSize: "18px",
    fontWeight: "bold",
    margin: "0",
  },
  alertHeader: {
    textAlign: "center",
    marginBottom: "16px",
  },
  progressContainer: {
    margin: "20px 0",
    padding: "16px",
    backgroundColor: "#f9fafb",
    borderRadius: "6px",
  },
  progressLabel: {
    marginBottom: "8px",
  },
  progressText: {
    color: "#374151",
    fontSize: "14px",
    fontWeight: "500",
    margin: "0",
  },
  progressBar: {
    backgroundColor: "#e5e7eb",
    borderRadius: "4px",
    height: "8px",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: "4px",
    transition: "width 0.3s ease",
  },
  footer: {
    color: "#6b7280",
    fontSize: "14px",
    textAlign: "center",
    marginTop: "32px",
    paddingTop: "20px",
    borderTop: "1px solid #e5e7eb",
    lineHeight: "1.6",
  },
};

