using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using WPFClient.Connection;
using Npgsql;
using Telerik.Windows.Controls;

namespace WPFClient.Views
{
    /// <summary>
    /// Логика взаимодействия для AddEditForm.xaml
    /// </summary>
    public partial class AddEditDocForm : Page
    {
        public static TextBox textBoxNumber;
        public static RichTextBox richTbNote;
        public static RadDatePicker radDatePicker;
        private NpgsqlConnection connection;
        #region Запросы
        private string sqlCreateDocument = "select cmn_doc.doc__insert_record();";
        private string sqlDeleteDocument = "select cmn_doc.doc__delete_record();";
        private string sqlFillDocumentFields = 
            "select cmn_doc.doc__set_number(:idRecord, :number);" +
            " select cmn_doc.doc__set_date(:idRecord, :date::t_date);" +
            " select cmn_doc.doc__set_sum(:idRecord, :sum::t_money);" +
            " select cmn_doc.doc__set_description(:idRecord, :description);" +
            " select cmn_doc.doc__after_edit(:idRecord);";
        #endregion

        public AddEditDocForm()
        {
            connection = PgConnection.Connection;
            InitializeComponent();
            dpDate.SelectedDate = DateTime.Now;
            //если добавление документа
            if (DocsWindow.isAddDoc)
            {
                tblockHeader.Text = "Новый документ";
                btnCancelChanges.Content = "Отмена";
                btnSaveChanges.Content = "Создать документ";
                tbSum.Text = "0";
            }
            //если редактирование документа
            else
            {
                tblockHeader.Text = "Редактировать документ";
                btnCancelChanges.Content = "Закрыть";
                btnSaveChanges.Content = "Сохранить изменения";
                tbNumber.Text = DocsWindow.SelectedDocument.Number;
                tbNote.Text = DocsWindow.SelectedDocument.Note;
                tbSum.Text = DocsWindow.SelectedDocument.Sum.ToString();
                dpDate.SelectedDate = DocsWindow.SelectedDocument.Date;
            }
        }

        /// <summary>
        /// Событие кнопки "Назад"
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void BtnCancelChanges_Click(object sender, RoutedEventArgs e)
        {
            //если какие-либо поля заполнены 
            if (DocsWindow.isAddDoc && (!string.IsNullOrEmpty(tbNumber.Text) ||
            !string.IsNullOrEmpty(tbNote.Text)))
            {
                //точно ли выходить?
                MessageBoxResult result = MessageBox.Show("Выйти без сохранения?", "Message", MessageBoxButton.YesNo);
                if (result == MessageBoxResult.Yes)
                    NavigationService.GetNavigationService(this).GoBack();
            }
            else
                //просто выходим
                NavigationService.GetNavigationService(this).GoBack();
        }

        /// <summary>
        /// Функция создания нового документа
        /// </summary>
        /// <returns>id нового документа</returns>
        private int CreateDocument()
        {
            if (connection != null)
            {
                try
                {
                    using (NpgsqlCommand command = new NpgsqlCommand(sqlCreateDocument, connection))
                    {
                        using (NpgsqlDataReader reader = command.ExecuteReader())
                        {
                            reader.Read();
                            var test = reader.GetInt32(0);
                            return test;
                        }
                    }
                }
                catch(Exception e)
                {
                    MessageBox.Show($"Не удалось создать новый документ! {e.Message}",
                        "ERROR", MessageBoxButton.OK, MessageBoxImage.Error);
                }
            }
            return -1;
        }

        /// <summary>
        /// Функция заполнения полей созданного документа
        /// </summary>
        /// <param name="idRecord">id нового документа</param>
        /// <param name="sum">Сумма</param>
        /// <returns>Признак заполнения полей нового документа</returns>
        private bool FillDocumentFields(int idRecord)
        {
            DateTime currentDate = DateTime.Now.Date;
            if (connection != null)
            {
                try
                {
                    using (NpgsqlCommand command = new NpgsqlCommand(sqlFillDocumentFields, connection))
                    {
                        command.Parameters.AddWithValue("idRecord", idRecord);
                        command.Parameters.AddWithValue("number", tbNumber.Text);
                        command.Parameters.AddWithValue("date", dpDate.SelectedDate.Value);
                        //при создании документа сумма равно 0
                        if (DocsWindow.isAddDoc)
                            command.Parameters.AddWithValue("sum", 0);
                        else
                        {
                            float sum = float.Parse(tbSum.Text);
                            command.Parameters.AddWithValue("sum", sum);
                        }
                        command.Parameters.AddWithValue("description", tbNote.Text);
                        command.ExecuteNonQuery();
                        return true;
                    }
                }
                catch(Exception e)
                {
                    if (DocsWindow.isAddDoc)
                        MessageBox.Show($"Не удалось заполнить поля нового документа." +
                            $"\r\n{e.Message}" +
                            $"\r\nДокумент будет удалён.", "ERROR", MessageBoxButton.OK, MessageBoxImage.Error);
                    else
                        MessageBox.Show($"Не удалось изменить поля документа." +
                            $"\r\n{e.Message}");
                }
            }
            return false;
        }

        /// <summary>
        /// Функция удаления документа
        /// </summary>
        /// <param name="idRecord">id документа</param>
        private void DeleteDocument(int idRecord)
        {
            if (connection != null)
            {
                try
                {
                    using (NpgsqlCommand command = new NpgsqlCommand(sqlDeleteDocument, connection))
                    {
                        command.Parameters.AddWithValue("idRecord", idRecord);
                        command.ExecuteNonQuery();
                    }
                }
                catch (Exception e)
                {
                    MessageBox.Show($"Не удалось удалить документ! {e.Message}");
                }
            }
        }

        private void BtnSaveChanges_Click(object sender, RoutedEventArgs e)
        {
            #region Проверки
            if (string.IsNullOrEmpty(tbNote.Text) ||
                string.IsNullOrEmpty(tbNumber.Text))
            {
                MessageBox.Show("Заполните все поля!");
                return;
            }
            #endregion
            //если создание нового документа
            if (DocsWindow.isAddDoc)
            {
                //создать новый документ
                int idRecord = CreateDocument();
                if (idRecord != -1)
                {
                    //заполнить поля документа
                    //если поля документа не были заполнены
                    if (!FillDocumentFields(idRecord))
                        //удалить созданный документ
                        DeleteDocument(idRecord);
                    //вернуться на форму с документами и позициями
                    NavigationService.GetNavigationService(this).GoBack();
                }
                else
                    MessageBox.Show("Документ не был создан! Попробуйте ещё раз", "ERROR",
                        MessageBoxButton.OK, MessageBoxImage.Error);
            }
            //если редактирование документа
            else
            {
                //изменить выбранный документ
                FillDocumentFields(DocsWindow.SelectedDocument.Id);
                //вернуться на форму с документами и позициями
                NavigationService.GetNavigationService(this).GoBack();
            }
        }
    }
}
