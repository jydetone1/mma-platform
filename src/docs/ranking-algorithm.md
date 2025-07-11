# Ranking Algorithm

## Overview

The ranking algorithm is a points-based system that updates fighter rankings within their weight class after each fight. Rankings are updated asynchronously using a Bull queue to ensure non-blocking performance.

## Points System

- **Win via Knockout/Submission**: 4 points
- **Win via Decision**: 3 points
- **Draw**: 1 point
- **Loss**: 0 points

## Tiebreakers

1. Higher win percentage (wins / total fights).
2. Most recent fight activity (based on last fight date).

## Implementation

1. When a fight result is recorded, a job is queued to update rankings.
2. For each fighter in the fight:
   - Calculate points based on outcome and method.
   - Update the fighter's ranking record with new points, win percentage, and last fight date.
3. Sort all fighters in the weight class by:
   - Total points (descending).
   - Win percentage (descending, for tiebreaker).
   - Last fight date (most recent first, for tiebreaker).
4. Assign rank positions (1, 2, 3, and so on) based on the sorted order.

## Example

Fighter A wins via knockout: +4 points.
Fighter B loses: +0 points.
Rankings are recalculated for their weight class, and Fighter A's rank improves based on total points and tiebreakers.
