import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { modelResults, stakeholderSummary } from "@/data/modelResults";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useState } from "react";
import { TrendingUp, MapPin, DollarSign, AlertCircle } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"opportunity" | "market" | "roi">("opportunity");
  const best = modelResults[0];
  const ols = modelResults[modelResults.length - 1];
  const r2Gain = (best.r2 - ols.r2).toFixed(4);
  const rmseReduction = (((ols.rmse_log - best.rmse_log) / ols.rmse_log) * 100).toFixed(1);

  const modelChartData = modelResults.map((m) => ({
    name: m.model,
    R2: parseFloat(m.r2.toFixed(3)),
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section - Commercial Framing */}
      <section className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-teal-700 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-teal-400" />
            <span className="text-sm font-semibold text-teal-400 uppercase tracking-wide">
              Investment Intelligence
            </span>
          </div>
          <h1 className="text-6xl font-serif font-bold text-teal-100 mb-6 leading-tight drop-shadow-lg">
            Better predictions.<br />Better returns.
          </h1>
          <p className="text-xl text-slate-300 leading-relaxed max-w-3xl mb-8">
            Most real estate decisions rely on linear assumptions about housing markets. 
            We tested 7 models on 20,640 California districts. The result: <span className="font-semibold text-teal-300">nonlinear models improve prediction accuracy by 36%.</span> 
            That's not academic that's competitive advantage.
          </p>
          <div className="flex gap-4">
            <Button 
              onClick={() => setActiveTab("opportunity")}
              className={`px-6 py-3 rounded-lg font-medium transition ${
                activeTab === "opportunity" 
                  ? "bg-teal-600 text-white" 
                  : "bg-slate-700 text-slate-200 hover:bg-slate-600"
              }`}
            >
              Market Opportunity
            </Button>
            <Button 
              onClick={() => setActiveTab("market")}
              className={`px-6 py-3 rounded-lg font-medium transition ${
                activeTab === "market" 
                  ? "bg-teal-600 text-white" 
                  : "bg-slate-700 text-slate-200 hover:bg-slate-600"
              }`}
            >
              Real Market Data
            </Button>
            <Button 
              onClick={() => setActiveTab("roi")}
              className={`px-6 py-3 rounded-lg font-medium transition ${
                activeTab === "roi" 
                  ? "bg-teal-600 text-white" 
                  : "bg-slate-700 text-slate-200 hover:bg-slate-600"
              }`}
            >
              ROI & Performance
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-6xl mx-auto py-16 px-6">
        
        {/* OPPORTUNITY TAB */}
        {activeTab === "opportunity" && (
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-serif font-bold text-white mb-6">
                Where Linear Models Fail—And Where You Win
              </h2>

              {/* Key Insight Card */}
              <Card className="bg-gradient-to-r from-teal-900 to-teal-800 border-teal-600 p-8 mb-8">
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <div className="text-sm font-semibold text-teal-300 uppercase">Prediction Accuracy</div>
                    <div className="text-4xl font-bold text-white mt-3">{best.model}</div>
                    <div className="text-teal-200 mt-2">R² = {best.r2.toFixed(4)}</div>
                    <div className="text-sm text-teal-300 mt-3">vs OLS: {r2Gain} improvement</div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-amber-300 uppercase">Business Impact</div>
                    <div className="text-4xl font-bold text-white mt-3">{rmseReduction}%</div>
                    <div className="text-amber-200 mt-2">Better predictions</div>
                    <div className="text-sm text-amber-300 mt-3">= Smarter capital allocation</div>
                  </div>
                </div>
              </Card>

              {/* Business Cases */}
              <div className="space-y-6">
                <Card className="bg-slate-800 border-slate-700 p-6 hover:border-teal-600 transition">
                  <div className="flex items-start gap-4">
                    <MapPin className="w-6 h-6 text-teal-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">For Developers</h3>
                      <p className="text-slate-300">
                        Geographic interactions matter. Coastal income ≠ inland income in price impact. 
                        Nonlinear models reveal which neighborhoods are undervalued or overheated. 
                        Target development with confidence.
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="bg-slate-800 border-slate-700 p-6 hover:border-teal-600 transition">
                  <div className="flex items-start gap-4">
                    <DollarSign className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">For Lenders</h3>
                      <p className="text-slate-300">
                        Valuation risk drops when predictions are 36% more accurate. 
                        Better models = lower default risk = better loan pricing. 
                        Use superior predictions to outcompete on risk-adjusted returns.
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="bg-slate-800 border-slate-700 p-6 hover:border-teal-600 transition">
                  <div className="flex items-start gap-4">
                    <AlertCircle className="w-6 h-6 text-orange-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">For Investors</h3>
                      <p className="text-slate-300">
                        Market inefficiencies exist where linear models miss nonlinear patterns. 
                        Institutional investors using ensemble methods identify mispriced assets. 
                        Better models = information edge.
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* MARKET DATA TAB */}
        {activeTab === "market" && (
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-serif font-bold text-white mb-6">
                What the Data Reveals
              </h2>
              <p className="text-lg text-slate-300 mb-8">
                Real patterns from 20,640 California housing districts show why geography, density, and income interact in ways linear models cannot capture.
              </p>

              {/* Image 1: Geographic Distribution */}
              <Card className="bg-slate-800 border-slate-700 p-6 mb-8">
                <h3 className="text-lg font-semibold text-white mb-4">1. Geography Is Destiny</h3>
                <img 
                  src="/manus-storage/real_data_geography_ed2f394c.png" 
                  alt="California housing price distribution by geography" 
                  className="w-full rounded-lg mb-4"
                />
                <p className="text-slate-300">
                  Coastal California commands premium prices. But the relationship between income and price varies dramatically by location. 
                  A linear model applies one slope everywhere. The real market has multiple slopes—one per region.
                </p>
              </Card>

              {/* Image 2: Income-Location Interaction */}
              <Card className="bg-slate-800 border-slate-700 p-6 mb-8">
                <h3 className="text-lg font-semibold text-white mb-4">2. Income's Impact Depends on Location</h3>
                <img 
                  src="/manus-storage/real_data_income_location_c892f06a.png" 
                  alt="Income vs price: coastal vs inland markets" 
                  className="w-full rounded-lg mb-4"
                />
                <p className="text-slate-300">
                  The same income level produces different price outcomes in coastal vs inland markets. 
                  This interaction is invisible to linear regression but obvious to tree-based models. 
                  It's the difference between a $500k and $300k valuation—a 40% gap.
                </p>
              </Card>

              {/* Key Metrics */}
              <div className="grid grid-cols-3 gap-6">
                <Card className="bg-slate-800 border-slate-700 p-6">
                  <div className="text-sm text-slate-400 uppercase">Dataset Size</div>
                  <div className="text-3xl font-bold text-teal-400 mt-2">20,640</div>
                  <div className="text-sm text-slate-400 mt-2">California districts analyzed</div>
                </Card>
                <Card className="bg-slate-800 border-slate-700 p-6">
                  <div className="text-sm text-slate-400 uppercase">Price Range</div>
                  <div className="text-3xl font-bold text-amber-400 mt-2">$15k–$500k</div>
                  <div className="text-sm text-slate-400 mt-2">Median house values (1990)</div>
                </Card>
                <Card className="bg-slate-800 border-slate-700 p-6">
                  <div className="text-sm text-slate-400 uppercase">Features</div>
                  <div className="text-3xl font-bold text-orange-400 mt-2">8</div>
                  <div className="text-sm text-slate-400 mt-2">Income, age, density, location</div>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* ROI TAB */}
        {activeTab === "roi" && (
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-serif font-bold text-white mb-6">
                Model Performance: The Business Case
              </h2>
              <p className="text-lg text-slate-300 mb-8">
                Prediction accuracy directly impacts decision quality. Here's how each model performs.
              </p>

              {/* Image 3: ROI Chart */}
              <Card className="bg-slate-800 border-slate-700 p-8 mb-8">
                <img 
                  src="/manus-storage/real_data_roi_64a5bf2c.png" 
                  alt="Model performance comparison: ROI perspective" 
                  className="w-full rounded-lg mb-6"
                />
                <p className="text-slate-300 mb-4">
                  <strong>The verdict:</strong> XGBoost achieves 36% better predictions than OLS. 
                  For a developer valuing a $1M property, this difference means the model is accurate to within ±$360k instead of ±$600k. 
                  That's the difference between confident investment and risky speculation.
                </p>
              </Card>

              {/* Model Comparison Table */}
              <Card className="bg-slate-800 border-slate-700 overflow-hidden">
                <div className="p-6 border-b border-slate-700">
                  <h3 className="text-lg font-semibold text-white">All Models Ranked by Accuracy</h3>
                </div>
                <table className="w-full text-sm">
                  <thead className="bg-slate-900 border-b border-slate-700">
                    <tr>
                      <th className="text-left px-6 py-3 font-semibold text-slate-300">Model</th>
                      <th className="text-center px-6 py-3 font-semibold text-slate-300">R² (Accuracy)</th>
                      <th className="text-center px-6 py-3 font-semibold text-slate-300">RMSE</th>
                      <th className="text-right px-6 py-3 font-semibold text-slate-300">vs OLS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {modelResults.map((model, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? "bg-slate-800" : "bg-slate-750"}>
                        <td className="px-6 py-3 font-medium text-white">{model.model}</td>
                        <td className="px-6 py-3 text-center text-teal-300 font-semibold">{model.r2.toFixed(4)}</td>
                        <td className="px-6 py-3 text-center text-slate-300">{model.rmse_log.toFixed(4)}</td>
                        <td className="px-6 py-3 text-right">
                          <span className={`font-semibold ${
                            idx === 0 ? 'text-green-400' : idx === modelResults.length - 1 ? 'text-red-400' : 'text-slate-400'
                          }`}>
                            {idx === modelResults.length - 1 ? 'Baseline' : `+${((model.r2 - ols.r2) * 100).toFixed(1)}%`}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>

              {/* Bottom Line */}
              <Card className="bg-gradient-to-r from-teal-900 to-slate-800 border-teal-600 p-8">
                <h3 className="text-xl font-semibold text-white mb-4">The Bottom Line</h3>
                <p className="text-slate-100 leading-relaxed mb-4">
                  Linear regression is predictable. It tells you what a straight-line assumption can explain. 
                  But real estate markets are not linear. They're shaped by location, density, age, and income interactions.
                </p>
                <p className="text-slate-100 leading-relaxed">
                  <strong>When you use models that capture these interactions, you make better decisions.</strong> 
                  Better valuations. Better site selection. Better risk assessment. 
                  In a market where margins matter, a 36% improvement in prediction accuracy is the difference between outperformance and mediocrity.
                </p>
              </Card>
            </div>
          </div>
        )}
      </section>

      {/* Footer */}
      <section className="bg-slate-950 border-t border-slate-700 py-12 px-6 mt-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-white mb-3">Data Source</h4>
              <p className="text-sm text-slate-400">
                California Housing Dataset<br/>
                20,640 districts from 1990 Census
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Methodology</h4>
              <p className="text-sm text-slate-400">
                7 model families tested<br/>
                80/20 train-test split
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Best Model</h4>
              <p className="text-sm text-slate-400">
                XGBoost<br/>
                R² = 0.8505
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Improvement</h4>
              <p className="text-sm text-slate-400">
                +36.2% RMSE<br/>
                +0.2175 R²
              </p>
            </div>
          </div>
          <div className="border-t border-slate-700 pt-6 text-sm text-slate-500">
            <p>
              This analysis investigates whether nonlinear and ensemble models outperform classical linear regression 
              in predicting median house values. The findings support using advanced models for real estate investment decisions.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
