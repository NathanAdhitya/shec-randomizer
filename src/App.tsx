import React, { useState } from "react";
import "@fontsource/roboto";
import "./App.css";
import {
  Box,
  Button,
  Container,
  CssBaseline,
  Divider,
  Grid,
  TextField,
  Typography,
} from "@material-ui/core";

const groupRegex = /^(.+?)(-(.))?$/gm;

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffleArray<T>(array: T[]): void {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function doRandomize(groups: string, themes: string) {
  const parsedGroups = Array.from(groups.matchAll(groupRegex));
  shuffleArray(parsedGroups);

  const parsedThemes = themes.split("\n");
  const count: Record<string, number> = {};

  const groupsAlreadyAssigned: Record<string, Set<string>> = {};

  const results: string[] = [];
  let currentSet = [...parsedThemes];
  for (const group of parsedGroups) {
    groupsAlreadyAssigned[group[1]] =
      groupsAlreadyAssigned[group[1]] ?? new Set();

    if (currentSet.length === 0) currentSet = [...parsedThemes];
    let success = false;
    while (!success) {
      const assigned = currentSet.splice(
        getRandomInt(0, currentSet.length - 1),
        1
      )[0];

      if (!groupsAlreadyAssigned[group[1]].has(assigned)) success = true;
      else {
        currentSet.push(assigned);
        if (currentSet.length <= 2) {
          currentSet = [...currentSet, ...parsedThemes];
        }
        continue;
      }

      results.push(`${group[0]} ${assigned}`);
      groupsAlreadyAssigned[group[1]].add(assigned);
      count[assigned] = (count[assigned] ?? 0) + 1;
    }
  }
  console.log(count);
  return results.sort().join("\n");
}

function App() {
  const [value, setValue] = useState<string>();
  const [groups, setGroups] = useState<string>("");
  const [themes, setThemes] = useState<string>("");

  return (
    <div className="App">
      <CssBaseline />
      <Container>
        <Box margin={2}>
          <Box margin={3}>
            <Grid item xs={12}>
              <Typography
                variant="h3"
                align="center"
                component="h1"
                gutterBottom
              >
                SHEC Theme Randomizer
              </Typography>
            </Grid>
          </Box>
          <Grid item xs={12}>
            <Box mb={5}>
              <Divider />
            </Box>
          </Grid>
          <Grid container spacing={2}>
            <Grid container item xs={6}>
              <TextField
                label="Themes"
                value={themes}
                onChange={(e) => setThemes(e.currentTarget.value)}
                multiline
                rows={10}
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid container item xs={6}>
              <TextField
                label="Groups"
                value={groups}
                onChange={(e) => setGroups(e.currentTarget.value)}
                multiline
                rows={10}
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid container item xs={12}>
              <Button
                variant="contained"
                onClick={() => setValue(doRandomize(groups, themes))}
                color="primary"
                size="large"
              >
                Randomize
              </Button>
            </Grid>
          </Grid>
        </Box>
        {value ? (
          <React.Fragment>
            <Box margin={2} mt={4}>
              <Divider />
            </Box>
            <Box margin={2} mt={3}>
              <Typography
                variant="h4"
                align="center"
                component="h1"
                gutterBottom
              >
                Results
              </Typography>
              <TextField
                multiline
                variant="outlined"
                value={value}
                fullWidth
              ></TextField>
            </Box>
          </React.Fragment>
        ) : null}
      </Container>
    </div>
  );
}

export default App;
