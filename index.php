<?php 
  require 'vendor/autoload.php';
  
  Dotenv::load(__DIR__);

  date_default_timezone_set('America/New_York');

  $app = new \Slim\Slim(array(
    'debug' => true
  ));

  $app->setName('rinju');

  //Routes
  $app->get('/', 'faucet');
  $app->get('/transaction', 'transaction');

  # lets go
  $app->run();
  
  function faucet() 
  {
    include('views/faucet.php');
  }

  function transaction()
  {
    header('Access-Control-Allow-Origin: *');
    header('Content-type: application/json;');
  
    $transaction = "https://blockchain.info/merchant/".$_ENV['guid']."/payment?password=".$_ENV['password']."&second_password=".$_ENV['secondpassword']."&to=".$_GET['address']."&amount=".$_ENV['amount'];
    $transaction = file_get_contents($transaction);
    $transaction = json_decode($transaction);

    if (isset($transaction->tx_hash)) {
      $response = array(
        'status' => '200',
        'data' => array(
          'tx_hash' => $transaction->tx_hash
        )
      );
    } else {
      $response = array(
        'status' => '500',
        'data' => array(
          'message' => $transaction->error
        )
      );
    }

    echo json_encode($response);
  }
?>