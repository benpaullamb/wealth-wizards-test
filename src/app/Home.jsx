/** @jsx jsx */
import { jsx, css } from '@emotion/react';
import { useState } from 'react';
import axios from 'axios';

// Allow a user to compare their NI contributions between 2018/19 and 2019/20
export default function Home() {
  const [income, setIncome] = useState(0);
  const [contributions2018, setContributions2018] = useState(0);
  const [contributions2019, setContributions2019] = useState(0);

  const getNationalInsurance = async (runDate) => {
    const { data } = await axios.post(
      '/v1/national-insurance',
      { income },
      {
        headers: {
          'x-run-date': runDate,
        },
      }
    );
    return data.ni;
  };

  const compareNationalInsurance = async () => {
    const contributionsA = await getNationalInsurance('2018-04-06');
    const contributionsB = await getNationalInsurance('2019-04-06');

    setContributions2018(contributionsA);
    setContributions2019(contributionsB);
  };

  return (
    <div>
      <h1>National Insurance Contributions Comparer</h1>

      <label htmlFor="income">
        Income
        <input
          type="number"
          id="income"
          value={income}
          onChange={(e) => setIncome(e.target.value)}
          onKeyDown={(e) => {
            if (e.key.toLowerCase() === 'enter') compareNationalInsurance();
          }}
        />
      </label>

      <table>
        <thead>
          <tr>
            <th />
            <th>2018/19</th>
            <th>2019/20</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>Contributions</th>
            <td>£{contributions2018}</td>
            <td>£{contributions2019}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
