"use client";
import React, { useState } from "react";

type Team = {
  name: string;
  runsScored: number;
  ballsFaced: number;
  runsConceded: number;
  ballsBowled: number;
};

const NRRCalculator: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [totalTeams, setTotalTeams] = useState(0);
  const [totalOvers, setTotalOvers] = useState(0);
  const [inputStep, setInputStep] = useState<"setup" | "names" | "done">(
    "setup"
  );
  const [newName, setNewName] = useState("");
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [matchData, setMatchData] = useState({
    runsScored: 0,
    ballsFaced: 0,
    runsConceded: 0,
    ballsBowled: 0,
  });

  const addTeam = () => {
    if (newName.trim()) {
      setTeams((prev) => [
        ...prev,
        { name: newName, runsScored: 0, ballsFaced: 0, runsConceded: 0, ballsBowled: 0 },
      ]);
      setNewName("");
      if (teams.length + 1 === totalTeams) setInputStep("done");
    }
  };

  const calcNRR = (team: Team) => {
    const oversFaced = team.ballsFaced / 6;
    const oversBowled = team.ballsBowled / 6;
    if (oversFaced === 0 || oversBowled === 0) return 0;
    const runRateFor = team.runsScored / oversFaced;
    const runRateAgainst = team.runsConceded / oversBowled;
    return runRateFor - runRateAgainst;
  };

  const handleMatchUpdate = () => {
    if (selectedTeams.length !== 2) return alert("Select 2 teams");

    const [t1, t2] = selectedTeams;
    setTeams((prev) =>
      prev.map((team) => {
        if (team.name === t1) {
          return {
            ...team,
            runsScored: team.runsScored + matchData.runsScored,
            ballsFaced: team.ballsFaced + matchData.ballsFaced,
            runsConceded: team.runsConceded + matchData.runsConceded,
            ballsBowled: team.ballsBowled + matchData.ballsBowled,
          };
        }
        if (team.name === t2) {
          return {
            ...team,
            runsScored: team.runsScored + matchData.runsConceded,
            ballsFaced: team.ballsFaced + matchData.ballsBowled,
            runsConceded: team.runsConceded + matchData.runsScored,
            ballsBowled: team.ballsBowled + matchData.ballsFaced,
          };
        }
        return team;
      })
    );
    setMatchData({ runsScored: 0, ballsFaced: 0, runsConceded: 0, ballsBowled: 0 });
    setSelectedTeams([]);
  };

  const sortedTeams = [...teams].sort((a, b) => calcNRR(b) - calcNRR(a));

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-4">NRR Calculator</h1>

      {inputStep === "setup" && (
        <div>
          <input
            type="number"
            placeholder="Total Teams"
            className="border p-2 m-2"
            onChange={(e) => setTotalTeams(Number(e.target.value))}
          />
          <input
            type="number"
            placeholder="Total Overs"
            className="border p-2 m-2"
            onChange={(e) => setTotalOvers(Number(e.target.value))}
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => setInputStep("names")}
          >
            Next
          </button>
        </div>
      )}

      {inputStep === "names" && (
        <div>
          <input
            type="text"
            placeholder="Team Name"
            className="border p-2 m-2"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <button
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={addTeam}
          >
            Add Team
          </button>
        </div>
      )}

      {inputStep === "done" && (
        <div>
          <h2 className="text-lg font-semibold">Teams</h2>
          <ul className="mb-4">
            {sortedTeams.map((t) => (
              <li key={t.name}>
                {t.name} - NRR: {calcNRR(t).toFixed(3)}
              </li>
            ))}
          </ul>

          <div className="mb-4">
            <h3 className="font-semibold">Update Match</h3>
            <select
              className="border p-2 m-2"
              onChange={(e) =>
                setSelectedTeams([e.target.value, selectedTeams[1] || ""])
              }
            >
              <option value="">Select Team 1</option>
              {teams.map((t) => (
                <option key={t.name} value={t.name}>
                  {t.name}
                </option>
              ))}
            </select>
            <select
              className="border p-2 m-2"
              onChange={(e) =>
                setSelectedTeams([selectedTeams[0] || "", e.target.value])
              }
            >
              <option value="">Select Team 2</option>
              {teams.map((t) => (
                <option key={t.name} value={t.name}>
                  {t.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Runs Scored (Team1)"
              className="border p-2 m-2"
              onChange={(e) =>
                setMatchData({ ...matchData, runsScored: Number(e.target.value) })
              }
            />
            <input
              type="number"
              placeholder="Balls Faced (Team1)"
              className="border p-2 m-2"
              onChange={(e) =>
                setMatchData({ ...matchData, ballsFaced: Number(e.target.value) })
              }
            />
            <input
              type="number"
              placeholder="Runs Conceded (Team1)"
              className="border p-2 m-2"
              onChange={(e) =>
                setMatchData({ ...matchData, runsConceded: Number(e.target.value) })
              }
            />
            <input
              type="number"
              placeholder="Balls Bowled (Team1)"
              className="border p-2 m-2"
              onChange={(e) =>
                setMatchData({ ...matchData, ballsBowled: Number(e.target.value) })
              }
            />

            <button
              className="bg-purple-500 text-white px-4 py-2 rounded"
              onClick={handleMatchUpdate}
            >
              Update NRR
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NRRCalculator;
