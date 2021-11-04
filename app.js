$(document).ready(function () {
    console.log('jQuery funciona');
    $('#task-result').hide();
    fetchTasks();
    let editar = false;

    $('#search').keyup(function (e) {
        if ($('#search').val()) {
            let search = $('#search').val();
            //console.log(search);

            $.ajax({
                url: 'task-search.php',
                type: 'POST',
                data: { search },
                success: function (response) {
                    //console.log(response);

                    let tasks = JSON.parse(response);
                    let template = '';

                    tasks.forEach(task => {
                        //console.log(tasks);

                        template +=
                            `<li>
                                ${task.name}
                            </li>`
                    });

                    $('#container').html(template);
                    $('#task-result').show();
                }
            });
        }
    });

    $('#task-form').submit(function (e) {
        //console.log('submiting');

        const postData = {
            name: $('#name').val(),
            description: $('#description').val(),
            id: $('#taskId').val()
        };
        //console.log(postData);

        // Valor ternario. Si editar es true, entonces se hace una actualizacion, sino se hace una insercion
        let url = editar === false ? 'task-add.php' : 'task-edit.php' ;
        console.log(url);

        if (url === 'task-edit.php') {
            if (confirm('¿Esta seguro de que quiere editar esta tarea?')){
                $.post(url, postData, function(response) {
                    console.log(response);
                    fetchTasks();

                    $('#task-form').trigger('reset');
                });
            }
        }

        else {
            $.post(url, postData, function(response) {
                console.log(response);
                fetchTasks();

                $('#task-form').trigger('reset');
            });
        }

        e.preventDefault();
    });

    function fetchTasks() {
        $.ajax({
            url: 'task-list.php',
            type: 'GET',
            success: function (response) {
                //console.log(response);
    
                let tasks = JSON.parse(response);
                let template = '';
    
                tasks.forEach(task => {
                    template += 
                    `<tr taskId="${task.id}">
                        <td>
                            ${task.id}
                        </td>
                        <td>
                            <a href="#" class="task-item">${task.name}</a>
                        </td>
                        <td>
                            ${task.description}
                        </td>
                        <td>
                            <button class="task-delete btn btn-danger">
                                DELETE
                            </button>
                        </td>
                    </tr>`
                });
    
                $('#tasks').html(template);
            }
        });
    }

    $(document).on('click', '.task-delete', function () {
        if(confirm('¿Esta seguro de que quiere eliminar esta tarea?')){
            //console.log('clickeado');
            //console.log($this);

            const element = $(this)[0].parentElement.parentElement;
            const id = $(element).attr('taskId');
            //console.log(element);
            //console.log(id);

            $.post('task-delete.php', {id}, function(response) {
                //console.log(response);

                fetchTasks();
            }); 
        }
    });

    $(document).on('click', '.task-item', function () {
        //console.log('editando');

        const element = $(this)[0].parentElement.parentElement;
        const id = $(element).attr('taskId');
        //console.log(id);

        $.post('task-single.php', {id}, function(response) {
            //console.log(response);

            const task = JSON.parse(response);
            $('#name').val(task.name);
            $('#description').val(task.description);
            $('#taskId').val(task.id);

            editar = true;
        })
    });

});