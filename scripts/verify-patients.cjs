const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, file) =>
  module._compile(
    ts.transpileModule(fs.readFileSync(file, 'utf8'), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2020,
        esModuleInterop: true,
      },
    }).outputText,
    file,
  );
const { patients } = require('../src/data/demo-patients');
const { ageGroupFor, sexFor } = require('../src/features/patients/model/demographics');
const {
  filterPatients,
  emptyPatientFilters,
} = require('../src/features/patients/model/patient-filters');
for (const [age, group] of [
  [0, 'children'],
  [11, 'children'],
  [12, 'teens'],
  [17, 'teens'],
  [18, 'young'],
  [29, 'young'],
  [30, 'adults'],
  [59, 'adults'],
  [60, 'older'],
  [120, 'older'],
])
  assert.equal(ageGroupFor(age).id, group);
assert.equal(sexFor({ ...patients[0], sex: undefined }), 'unknown', 'Do not infer sex from a name');
const synthetic = [
  { ...patients[0], id: 'QA-1', name: 'Zoe Prueba', age: 8, sex: 'female' },
  { ...patients[1], id: 'QA-2', name: 'Ana Prueba', age: 16, sex: 'female' },
  { ...patients[0], id: 'QA-3', name: 'Luis Prueba', age: 8, sex: 'male' },
];
assert.deepEqual(
  filterPatients(synthetic, {
    ...emptyPatientFilters,
    age: 'children',
    sex: 'female',
    segment: 'allergies',
  }).map((patient) => patient.id),
  ['QA-1'],
);
assert.equal(
  filterPatients(synthetic, { ...emptyPatientFilters, search: '  qa-2  ' })[0].name,
  'Ana Prueba',
);
assert.equal(
  filterPatients(synthetic, { ...emptyPatientFilters, search: 'Sin coincidencia' }).length,
  0,
);
const before = synthetic.map((patient) => patient.id);
assert.deepEqual(
  filterPatients(synthetic, { ...emptyPatientFilters, ascending: true }).map(
    (patient) => patient.name,
  ),
  ['Ana Prueba', 'Luis Prueba', 'Zoe Prueba'],
);
assert.deepEqual(
  synthetic.map((patient) => patient.id),
  before,
  'Sorting must not mutate session records',
);
assert.equal(filterPatients(synthetic, emptyPatientFilters).length, 3);
console.log(
  'Age boundaries, combined filters, unknown sex, empty results and non-mutating sorting verified.',
);
