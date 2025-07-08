<!DOCTYPE html>
<html lang="en" dir="rtl">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title>@yield('title') </title>
    <!-- Font Awesome Icons -->
    <link rel="stylesheet" href="{{asset('plugins/font-awesome/css/font-awesome.min.css')}}">
    <!-- Theme style -->
    <link rel="stylesheet" href="{{asset('dist/css/adminlte.min.css')}}">
    <!-- bootstrap rtl -->
    <link rel="stylesheet" href="{{asset('dist/css/bootstrap-rtl.min.css')}}">
    <!-- template rtl version -->
    <link rel="stylesheet" href="{{asset('dist/css/custom-style.css')}}">
    <link rel="stylesheet" href="{{asset('plugins/toastr/toastr.min.css')}}">
    <link rel="stylesheet" href="{{asset('plugins/datatables/dataTables.bootstrap4.css')}}">
    <link rel="stylesheet" href="{{asset('plugins/select2/select2.min.css')}}">


</head>

<body class="hold-transition sidebar-mini">
    <div class="wrapper">
        @include('layouts.sidebar')
        <div class="content-wrapper">

            @section('content')




            @show


        </div>


        <!-- jQuery -->
        <script src="{{asset('plugins/jquery/jquery.min.js')}}"></script>
        <!-- Bootstrap -->
        <script src="{{asset('plugins/bootstrap/js/bootstrap.bundle.min.js')}}"></script>
        <!-- AdminLTE App -->
        <script src="{{asset('dist/js/adminlte.js')}}"></script>

        <!-- OPTIONAL SCRIPTS -->
        <script src="{{asset('dist/js/demo.js')}}"></script>


        <!-- SparkLine -->
        <script src="{{asset('plugins/sparkline/jquery.sparkline.min.js')}}"></script>
        <!-- jVectorMap -->
        <script src="{{asset('plugins/jvectormap/jquery-jvectormap-1.2.2.min.js')}}"></script>
        <script src="{{asset('plugins/jvectormap/jquery-jvectormap-world-mill-en.js')}}"></script>
        <!-- SlimScroll 1.3.0 -->
        <script src="{{asset('plugins/datatables/jquery.dataTables.js')}}"></script>
        <script src="{{asset('plugins/datatables/dataTables.bootstrap4.js')}}"></script>
        <!-- ChartJS 1.0.2 -->
        <script src="{{asset('plugins/chartjs-old/Chart.min.js')}}"></script>
        <script src="{{asset('plugins/toastr/toastr.min.js')}}"></script>
        <script src="{{asset('plugins/select2/select2.full.min.js')}}"></script>
        <script src="{{asset('js/jquery.PrintArea.js')}}"></script>



        <script type="text/javascript">
            var loadFile = function(event) {
                var reader = new FileReader();
                reader.onload = function() {
                    var output = document.getElementById('output');
                    output.src = reader.result;
                };
                reader.readAsDataURL(event.target.files[0]);
            };

            var loadImage = function(event) {
                var reader = new FileReader();
                reader.onload = function() {
                    var output1 = document.getElementById('output1');
                    output1.src = reader.result;
                };
                reader.readAsDataURL(event.target.files[0]);
            };


            var loadFingure = function(event) {
                var reader = new FileReader();
                reader.onload = function() {
                    var output2 = document.getElementById('output2');
                    output2.src = reader.result;
                };
                reader.readAsDataURL(event.target.files[0]);
            };



            $("#owner_sign").click(function() {
                $("#owner_card_body").slideToggle();
            });



            $(document).ready(function() {
                $("#print").click(function() {
                    var mode = 'iframe';
                    var close = mode == 'popup';
                    var options = {
                        mode: mode,
                        popClose: close
                    };
                    $('div.printTable').printArea(options);
                });
            });




            function isNumber(evet) {
                evet = (evet) ? evet : window.event;
                var charCode = (evet.which) ? evet.which : evet.keyCode;
                if (charCode > 31 && (charCode < 48 || charCode > 57)) {
                    return false;
                }
                return true;
            }


            $(document).ready(function() {
                $('#example').DataTable();
            });

            $('.select2').select2();

            <?php
            if (session()->has('msg')) {
            ?>
                toastr.success("<?= session()->get('msg') ?>");
            <?php }
            ?>
        </script>
        @section('pageJs')


        @show
    </div>
</body>

</html>
