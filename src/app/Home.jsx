/** @jsx jsx */
import { jsx } from '@emotion/react';
import { useState } from 'react';
import axios from 'axios';

// Allow a user to compare their NI contributions between 2018/19 and 2019/20
export default function Home() {
  const [income, setIncome] = useState(0);
  const [ni2018, setNI2018] = useState(0);
  const [ni2019, setNI2019] = useState(0);

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
    const niA = await getNationalInsurance('2018-04-06');
    const niB = await getNationalInsurance('2019-04-06');

    setNI2018(niA);
    setNI2019(niB);
  };

  return (
    <div className="mx-auto max-w-7xl p-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl">National Insurance Comparer</h1>

        <div className="mt-8">
          <label htmlFor="income" className="block text-lg font-medium leading-6 text-gray-900">
            Income
          </label>
          <div className="relative mt-2 rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-gray-500 text-lg">£</span>
            </div>
            <input
              type="number"
              id="income"
              className="block w-full rounded-md border-0 py-1.5 pl-7 pr-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
              placeholder="0.00"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              onKeyDown={(e) => {
                if (e.key.toLowerCase() === 'enter') compareNationalInsurance();
              }}
            />
          </div>
        </div>

        <div className="mt-8">
          <div className="-mx-8 -my-2 py-2 px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr className="divide-x divide-gray-200">
                  <th
                    scope="col"
                    className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900">
                    2018/19
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900">
                    2019/20
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                <tr className="divide-x divide-gray-200">
                  <td className="whitespace-nowrap p-4 text-lg text-gray-900">
                    £{ni2018}
                  </td>
                  <td className="whitespace-nowrap p-4 text-lg text-gray-500">
                    £{ni2019}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
