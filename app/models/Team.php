<?php
class Team
{
  public $team_id;
  public $name;
  public $hourly_rate;
  public function __construct($data) {
    $this->team_id = intval($data['team_id']);
    $this->name = $data['name'];
    $this->hourly_rate = floatval($data['hourly_rate']);
  }
  public static function fetchAll() {
    // 1. Connect to the database
    $db = new PDO(DB_SERVER, DB_USER, DB_PW);
    // 2. Prepare the query
    $sql = 'SELECT * FROM Teams';
    $statement = $db->prepare($sql);
    // 3. Run the query
    $success = $statement->execute();
    // 4. Handle the results
    $arr = [];
    while ($row = $statement->fetch(PDO::FETCH_ASSOC)) {
      $theTeam =  new Team($row);
      array_push($arr, $theTeam);
    }
    return $arr;
  }
}
