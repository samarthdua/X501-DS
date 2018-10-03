<?php
$work = new Work($_POST);

$work->create();
echo json_encode($work);
