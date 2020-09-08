<h4> How to Play Minesweeper </h4>
<h5> Game Description </h5>
Minesweeper is a single-player video game. The goal of the game is to clear a board of boxes containing hidden mines without hitting any of them. There is a set amount of mines. The player must click around the board, uncovering boxes that either contain mines or information about the neighboring boxes. If you uncover a mine, you lose the game. If you traverse the board and uncover every box besides those with mines, you win.

<h5> Game Actions </h5>
<u>Flag</u> - To flag a box, <kbd>right-click</kbd> on the box you would like to flag. The box will turn <span class = "flag-example">yellow</span> to indicate that it has been flagged. Flags should be used as a personal marker for boxes that the player believes contain mines. A flagged box can no longer be uncovered.
<br><br>
<u>Unflag</u> - To unflag a box, <kbd>right-click</kbd> on the box you would like to unflag. The box will turn  <span class = "covered-example">dark gray</span> to indicate that it has been flagged. The box will be uncoverable at this point.
<br><br>
<u>Uncover</u> - To uncover a box, <kbd>left-click</kbd> the box you would like to uncover. This will reveal the contents of the box underneath, which can either be a mine, which will be  <span class = "mine-example">red</span>, or empty, which will be  <span class = "uncovered-example">light gray</span>. If a box that has been uncovered has no neighboring boxes (neighboring boxes are any boxes touching the current box) that are mines, the surrounding boxes will automatically be uncovered until empty boxes with neighbors are reached. If uncovered boxes have neighboring boxes that are mines, the number of neighboring boxes that are mines will be displayed in the uncovered box.

<h5> Game Instructions </h5>
To play, traverse the board by uncovering boxes. When you come accross a box with no mines, use the number of neighboring boxes with mines and the number of uncovered neighboring boxes to deduce the locations of the mines and flag them to avoid accidentally uncovering them. If you uncover a mine, you lose the game. If you successfully uncover all boxes except those with mines, you win the game.

<h5> Game Board Guide </h5>
<span class = "how-to-row">
  <div class = "square flag-example"></div><div class = "description"> = Flag</div>
</span>
<br>
<span class = "how-to-row">
  <div class = "square mine-example"></div><div class = "description"> = Mine</div>
</span>
<br>
<span class = "how-to-row">
  <div class = "square covered-example"></div> <div class = "description"> = Covered Box</div>
</span>
<br>
<span class = "how-to-row">
  <div class = "square uncovered-example">?</div> <div class = "description"> = Uncovered Box</div>
</span>
